# Phase III Task Breakdown: AI-Powered Todo Chatbot

## Overview

This document breaks down the Phase III implementation plan into atomic, executable tasks. Each task corresponds to specific functionality defined in the specification and implementation plan.

## Task List

### T-301: Backend AI Dependency Setup

- **Description**: Install and configure required AI libraries and OpenRouter integration
- **Preconditions**: Phase II is complete
- **Implementation Scope**: Install `openai`, `python-dotenv`. Configure `.env` with OpenRouter keys and model IDs.
- **Files/Modules**: `backend/requirements.txt`, `backend/.env`
- **References**:
  - Spec: Architecture > AI Engine

### T-302: Database Schema for Conversations

- **Description**: Implement SQLModel models for chat persistence
- **Preconditions**: SQLModel is configured
- **Implementation Scope**: Create `Conversation` and `Message` models with relationship to `User`.
- **Files/Modules**: `backend/models/conversation.py`, `backend/models/message.py`
- **References**:
  - Spec: Domain Model: Chat

### T-303: Core Chat API Implementation

- **Description**: Create the main POST endpoint for AI interaction
- **Preconditions**: T-302 completed
- **Implementation Scope**: Implement `POST /api/chat`, integrating history retrieval, tool definitions, and AI response generation.
- **Files/Modules**: `backend/api/chat.py`
- **References**:
  - Spec: Web API Endpoints > Chat Endpoints

### T-304: AI Tool execution Layer

- **Description**: Implement the logic to execute tasks on behalf of the AI
- **Preconditions**: T-303 started
- **Implementation Scope**: Create `execute_tool` function mapping AI requests to existing CRUD logic. Ensure strict user scoping.
- **Files/Modules**: `backend/api/chat.py`, `backend/mcp_service/tools.py`
- **References**:
  - Spec: MCP Tools (AI Function Calling)

### T-305: Unstructured Tool Output Fallback (Nemotron)

- **Description**: Implement XML-based tool parsing for models like Nemotron-Nano
- **Preconditions**: T-304 completed
- **Implementation Scope**: Add Regex-based parser to handle `<tool_call>` patterns in the model's text response.
- **Files/Modules**: `backend/api/chat.py`
- **References**:
  - Spec: Acceptance Criteria > AC-302

### T-306: Frontend Chat Infrastructure

- **Description**: Create the basic chat page and API client integration
- **Preconditions**: Backend API T-303 completed
- **Implementation Scope**: Create `/chat` page and `apiClient` methods for sending/receiving messages.
- **Files/Modules**: `frontend/app/chat/page.tsx`, `frontend/lib/api.ts`
- **References**:
  - Spec: Web API Endpoints

### T-307: Chat UI Components

- **Description**: Build reusable chat bubble and input components
- **Preconditions**: T-306 started
- **Implementation Scope**: Implement `MessageBubble` (differentiating User/Assistant) and `ChatInput`.
- **Files/Modules**: `frontend/components/chat/MessageBubble.tsx`, `frontend/components/chat/ChatInput.tsx`
- **References**:
  - Spec: User Stories > US-304

### T-308: Chat History and Session Management

- **Description**: Implement conversation listing and message hydration
- **Preconditions**: T-307 completed
- **Implementation Scope**: Build UI to list past conversations and load message history on selection.
- **Files/Modules**: `frontend/app/chat/page.tsx`, `frontend/components/chat/ChatWindow.tsx`
- **References**:
  - Spec: User Stories > US-304

### T-309: Dashboard AI Integration

- **Description**: Add entry points to the AI Chat from the main dashboard
- **Preconditions**: T-306 completed
- **Implementation Scope**: Add "Chat with AI" button and quick-action links to the dashboard.
- **Files/Modules**: `frontend/app/dashboard/page.tsx`
- **References**:
  - Spec: Acceptance Criteria > AC-301

### T-310: Phase III Testing and Validation

- **Description**: Perform end-to-end testing of AI task management
- **Preconditions**: All Phase III tasks completed
- **Implementation Scope**: Verify task creation, completion, and history persistence via chat.
- **Files/Modules**: All Chat modules
- **References**:
  - Spec: Acceptance Criteria
