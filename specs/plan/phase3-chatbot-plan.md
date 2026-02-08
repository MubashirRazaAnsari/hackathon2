# Phase III Plan: AI-Powered Todo Chatbot

## Overview

This plan outlines the implementation of an AI-powered chatbot for the Todo application. The chatbot will allow users to manage their tasks through natural language, leveraging OpenAI's Agents SDK and the Model Context Protocol (MCP) for standardized tool usage.

## Architecture Strategy

### Technology Stack

- **Frontend**: Next.js 16+ (existing), React 19.
- **Backend**: FastAPI (existing), extended with:
  - `openai-agents-sdk`
  - `mcp` (Model Context Protocol SDK)
- **Database**: Neon PostgreSQL (existing), adding `conversations` and `messages` tables.
- **AI**: OpenAI Agents SDK (Agent + Runner).

## Backend Architecture

### New Components

1.  **MCP Server Module** (`backend/mcp/server.py`):
    - Defines the MCP server instance.
    - Registers tools: `add_task`, `list_tasks`, `update_task`, `delete_task`, `complete_task`.
    - Implements tool logic using existing Service/CRUD layers.

2.  **Agent Module** (`backend/core/agent.py`):
    - Configures the OpenAI Agent.
    - Connects Agent to the MCP Server tools.

3.  **Chat Endpoint** (`backend/api/chat.py`):
    - `POST /api/chat`: Handles user messages.
    - Orchestrates the Agent execution.
    - Persists chat history to the database.

### Database Schema Updates

- **conversations**: `id`, `user_id`, `created_at`, `updated_at`.
- **messages**: `id`, `conversation_id`, `role` (user/assistant), `content`, `created_at`.

## Frontend Architecture

### New Chat Interface

- **Page**: `/app/chat/page.tsx`
  - Main entry point for the chat feature.
- **Components**:
  - `components/chat/ChatWindow.tsx`: Displays message history.
  - `components/chat/MessageBubble.tsx`: Individual message styling.
  - `components/chat/ChatInput.tsx`: Input field for new messages.

### Integration

- **API Client Update**: Add `chat` method to `lib/api.ts`.
- **State Management**: Use local state for the chat history, syncing with the backend.

## Implementation Steps

### 1. Database & Models

- Create `Conversation` and `Message` SQLModel classes.
- Generate and apply Alembic migrations.

### 2. Backend Logic

- Install dependencies: `pip install mcp openai-agents-sdk`. (Note: exact package names to be verified).
- Refactor Task CRUD logic into reliable functions/services if not already separated, to be reusable by MCP tools.
- Implement MCP Server and Tools.
- Implement Agent Runner logic.
- Create Chat API endpoint.

### 3. Frontend UI

- Build the Chat UI components.
- Connect to the Chat API.
- Ensure responsive and "premium" design (glassmorphism, smooth animations).

## Security

- **Auth**: The Chat Endpoint is protected by JWT.
- **Scoping**: The MCP Server must injected with the `current_user` context to ensure it only lists/modifies the user's own tasks.

## Testing

- Test MCP tools individually.
- Test Chat Endpoint with Postman/Curl.
- Test Frontend UI flow.
