from mcp.server import Server
from .tools import add_task, list_tasks, update_task, delete_task, complete_task
import mcp.types as types

# Initialize MCP Server
mcp_server = Server("todo-mcp")

# Register tools
@mcp_server.tool()
async def add_todo_task(user_id: str, title: str, description: str = None) -> str:
    """Add a new task to the list."""
    result = add_task(user_id, title, description)
    return str(result)

@mcp_server.tool()
async def get_todo_tasks(user_id: str, status: str = "all") -> str:
    """List all tasks, optionally filtered by status (pending/completed/all)."""
    result = list_tasks(user_id, status)
    return str(result)

@mcp_server.tool()
async def update_todo_task(user_id: str, task_id: str, title: str = None, description: str = None) -> str:
    """Update a task's title or description."""
    result = update_task(user_id, task_id, title, description)
    return str(result)

@mcp_server.tool()
async def delete_todo_task(user_id: str, task_id: str) -> str:
    """Delete a task by ID."""
    result = delete_task(user_id, task_id)
    return str(result)

@mcp_server.tool()
async def complete_todo_task(user_id: str, task_id: str) -> str:
    """Mark a task as complete."""
    result = complete_task(user_id, task_id)
    return str(result)
