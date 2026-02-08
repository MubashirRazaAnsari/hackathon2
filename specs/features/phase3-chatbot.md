# Phase III Specification: AI-Powered Todo Chatbot

## Overview

Phase III introduces an AI-powered conversational interface to the Todo application. Users will be able to manage their tasks through natural language commands. The system employs an Agentic architecture using OpenAI's compatible APIs (via OpenRouter) and a custom tool execution layer to standardize task management.

## User Stories

### US-301: Natural Language Task Creation

As a user, I want to create tasks using natural language (e.g., "Remind me to buy milk at 5pm") so that I can quickly capture my thoughts without filling out forms.

### US-302: Conversational Task Retrieval

As a user, I want to ask the chatbot about my current tasks (e.g., "What do I need to do today?") so that I can get a quick summary of my workload.

### US-303: AI-Driven Task Updates

As a user, I want to mark tasks as complete or delete them via chat (e.g., "I finished the grovery task") so that I can manage my list using voice or simple text commands.

### US-304: Persistent Chat History

As a user, I want my conversations with the AI to be saved so that I can refer back to previous interactions or continue a context-heavy dialogue.

## Architecture

- **Frontend**: New Chat Interface responsive components using Tailwind CSS and React state management.
- **Backend**: FastAPI server extended with a custom tool-calling framework and OpenAI integration.
- **AI Engine**: OpenRouter (configured with the chosen free model like Nemotron) for cost-effective AI operations.
- **Tooling**: Internal tool execution layer logic exposing task operations as tools.
- **Database**: Neon PostgreSQL extended with `Conversation` and `Message` tables.
- **Statelessness**: The chat endpoint is stateless; context is re-hydrated from the database for each request turn.

## Domain Model: Chat

### Conversation

- **id** (UUID, required): Unique identifier for the chat session
- **user_id** (UUID, required): Owner of the conversation
- **title** (string, optional): Generated summary of the chat (max 100 characters)
- **created_at** (datetime, required): ISO 8601 timestamp
- **updated_at** (datetime, required): ISO 8601 timestamp

### Message

- **id** (UUID, required): Unique identifier for the message
- **conversation_id** (UUID, required): Link to the parent conversation
- **role** (string, required): One of: "user", "assistant", "system", "tool"
- **content** (text, required): The message body or JSON tool result
- **tool_call_id** (string, optional): External identifier for tool call tracking
- **created_at** (datetime, required): ISO 8601 timestamp

## Web API Endpoints

### Chat Endpoints

- `POST /api/chat` - Send a message and get an AI response
- `GET /api/chat/conversations` - List all chat sessions for the user
- `GET /api/chat/conversations/{id}/messages` - Retrieve message history for a specific session
- `DELETE /api/chat/conversations/{id}` - Delete a chat session

## MCP Tools (AI Function Calling)

The AI assistant is equipped with the following tools to manage the user's todo data:

1. **add_task**: Create a new task (params: title, description)
2. **list_tasks**: Retrieve tasks (params: status filter)
3. **update_task**: Modify existing task details (params: task_id, title/description)
4. **delete_task**: Remove a task (params: task_id)
5. **complete_task**: Mark a task as done (params: task_id)

## Acceptance Criteria

### AC-301: AI Task Management

- Given an authenticated user, when they send "Add a task to walk the dog", then the system should call `add_task` and the task should appear in the main task list.
- When a user asks "Show my pending tasks", the AI should call `list_tasks(status='pending')` and display the results formatted.
- When a user says "I did the dog task", the AI should identify the correct task ID and call `complete_task`.

### AC-302: Robust Tool Parsing (Fallback)

- Given a model that outputs raw XML (like Nemotron-Nano), when the AI returns `<tool_call>...`, then the backend fallback parser must correctly extract parameters and execute the tool.
- The system must handle cases where the AI doesn't yield a structured `tool_calls` object but provides a valid text-based tool request.

### AC-303: Context Awareness

- The chat session must include the last 10 messages of history so the AI can handle follow-up questions (e.g. "What was that task again?").
- The system prompt must enforce that the AI identifies as a "Todo Assistant".

### AC-304: Security & Privacy

- Users must only be able to view and interact with their own conversations.
- Tool execution must strictly use the `user_id` of the authenticated requester.

## Explicit Non-Goals

- No voice-to-text or text-to-voice (Phase III focus is text-based chat).
- No file uploads or image processing in chat.
- No multi-user collaboration in a single chat room.
- No real-time streaming (SSE/WebSockets) in the initial Phase III release (polling or standard JSON responses only).
- No complex multi-agent workflows (single agent architecture only).
