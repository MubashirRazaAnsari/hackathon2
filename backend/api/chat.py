from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select
from config.database import engine
from models.user import User
from models.conversation import Conversation
from models.message import Message
from core.auth import get_current_user
from mcp.server import Server
from mcp_service.tools import add_task, list_tasks, update_task, delete_task, complete_task
import openai
import json
import os

router = APIRouter()

# Initialize OpenAI client
# Initialize OpenAI client
client = openai.OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL")
)

MODEL_NAME = os.getenv("OPENAI_MODEL_NAME", "gpt-4-turbo-preview")

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    tool_calls: List[Dict[str, Any]] = []

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Create a new task with optional priority, tags, and due date",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                    "tags": {"type": "string", "description": "Comma-separated tags"},
                    "due_date": {"type": "string", "description": "ISO 8601 timestamp"},
                    "is_recurring": {"type": "boolean"},
                    "recurrence_pattern": {"type": "string", "enum": ["daily", "weekly", "monthly"]}
                },
                "required": ["title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List user tasks with filtering and sorting",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": ["all", "pending", "completed"]},
                    "sort": {"type": "string", "enum": ["created_at", "priority", "due_date"]}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update existing task properties",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string"},
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                    "tags": {"type": "string"},
                    "due_date": {"type": "string"},
                    "status": {"type": "string", "enum": ["pending", "completed"]}
                },
                "required": ["task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string"}
                },
                "required": ["task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark task as complete",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "string"}
                },
                "required": ["task_id"]
            }
        }
    }
]

def execute_tool(name: str, args: Dict[str, Any], user_id: str):
    """Execute tool call based on name."""
    if name == "add_task":
        return add_task(user_id, **args)
    elif name == "list_tasks":
        return list_tasks(user_id, **args)
    elif name == "update_task":
        return update_task(user_id, **args)
    elif name == "delete_task":
        return delete_task(user_id, **args)
    elif name == "complete_task":
        return complete_task(user_id, **args)
    return {"error": "Unknown tool"}

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    
    with Session(engine) as session:
        # 1. Get or Create Conversation
        if request.conversation_id:
            conversation = session.get(Conversation, request.conversation_id)
            if not conversation or conversation.user_id != user_id:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            conversation = Conversation(user_id=user_id, title=request.message[:50])
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

        # 2. Add User Message to History
        user_msg = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        session.add(user_msg)
        session.commit()

        # 3. Load History for Context (last 10 messages)
        history_stmt = select(Message).where(Message.conversation_id == conversation.id).order_by(Message.created_at.desc()).limit(10)
        history_msgs = session.exec(history_stmt).all()
        history_msgs = sorted(history_msgs, key=lambda x: x.created_at)
        
        messages = [{"role": "system", "content": "You are a helpful Todo assistant. Use the tools provided to manage tasks."}]
        for msg in history_msgs:
            messages.append({"role": msg.role, "content": msg.content})

        # 4. Call OpenAI with Tools
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto"
        )
        
        response_msg = completion.choices[0].message
        tool_calls_log = []
        
        # 5. Handle Tool Calls
        if response_msg.tool_calls:
            messages.append(response_msg) # Add assistant's tool request to context
            
            for tool_call in response_msg.tool_calls:
                fn_name = tool_call.function.name
                fn_args = json.loads(tool_call.function.arguments)
                tool_calls_log.append({"name": fn_name, "args": fn_args})
                
                # Execute tool
                tool_result = execute_tool(fn_name, fn_args, user_id)
                
                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": fn_name,
                    "content": json.dumps(tool_result)
                })
            
            # Second call to get final response
            final_completion = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages
            )
            final_content = final_completion.choices[0].message.content

        else:
            # Fallback for models that output XML-like tool calls in content (e.g. Nemotron)
            content = response_msg.content or ""
            if "<tool_call>" in content:
                try:
                    import re
                    # Extract function name
                    fn_match = re.search(r"<function=([^>]+)>", content)
                    if fn_match:
                        fn_name = fn_match.group(1).strip()
                        fn_args = {}
                        
                        # Attempt to extract parameter if it exists
                        param_match = re.search(r"<parameter=([^>]+)>\s*([^<]+)\s*</parameter>", content)
                        if param_match:
                            param_name = param_match.group(1).strip()
                            param_value = param_match.group(2).strip()
                            fn_args[param_name] = param_value
                        
                        tool_calls_log.append({"name": fn_name, "args": fn_args})
                        
                        # Execute tool
                        tool_result = execute_tool(fn_name, fn_args, user_id)
                        
                        # Add conversational context
                        messages.append({"role": "assistant", "content": content})
                        messages.append({
                            "role": "user", 
                            "content": f"Tool execution result: {json.dumps(tool_result)}"
                        })
                        
                        # Get final response
                        final_completion = client.chat.completions.create(
                            model=MODEL_NAME,
                            messages=messages
                        )
                        final_content = final_completion.choices[0].message.content
                    else:
                        final_content = content
                except Exception as e:
                    print(f"Error parsing fallback tool call: {e}")
                    final_content = content
            else:
                final_content = content


        # 6. Add Assistant Message to History
        asst_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=final_content
        )
        session.add(asst_msg)
        session.commit()
        
        return ChatResponse(
            response=final_content,
            conversation_id=conversation.id,
            tool_calls=tool_calls_log
        )

@router.get("/conversations", response_model=List[Dict[str, Any]])
async def list_conversations(current_user: User = Depends(get_current_user)):
    """List all conversations for the authenticated user."""
    with Session(engine) as session:
        statement = select(Conversation).where(Conversation.user_id == current_user.id).order_by(Conversation.created_at.desc())
        results = session.exec(statement).all()
        return [{"id": c.id, "title": c.title, "created_at": c.created_at} for c in results]

@router.get("/conversations/{conversation_id}/messages", response_model=List[Dict[str, Any]])
async def get_messages(conversation_id: str, current_user: User = Depends(get_current_user)):
    """Retrieve message history for a specific conversation."""
    with Session(engine) as session:
        # Verify ownership
        conversation = session.get(Conversation, conversation_id)
        if not conversation or conversation.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at.asc())
        results = session.exec(statement).all()
        return [{"role": m.role, "content": m.content, "created_at": m.created_at} for m in results]
