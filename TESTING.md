# Testing Instructions

This document outlines how to set up and test the implementation of Phases I, II, and III (Console, Web App, AI Chatbot).

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Neon PostgreSQL Database** (or local Postgres)
- **OpenAI API Key**

## 1. Backend Setup

### Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file (if it doesn't exist) based on `.env.example`:
   ```bash
   # backend/.env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   JWT_SECRET=your_super_secret_jwt_key
   BETTER_AUTH_SECRET=your_better_auth_secret
   OPENAI_API_KEY=sk-...
   ```
   _Note: Ensure `OPENAI_API_KEY` is set for the Chatbot functionality._

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Server

1. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The server will start at `http://localhost:8000`.
   API Documentation is available at `http://localhost:8000/docs`.

### Testing Backend

- **Health Check**: Visit `http://localhost:8000/health`.
- **Swagger UI**: Visit `http://localhost:8000/docs` to manually test endpoints (Auth, Tasks, Chat).

## 2. Frontend Setup

### Configuration

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Create a `.env` file:
   ```bash
   # frontend/.env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 3. Testing Scenarios

### Phase II: Web App Features

1. **Authentication**:
   - Go to `http://localhost:3000/auth/signup`.
   - Register a new user.
   - Verify you are redirected to the Dashboard.
   - Logout and sign back in.

2. **Task Management**:
   - On the Dashboard, click "Create New Task".
   - Fill in title and description.
   - Verify the task appears on the Dashboard.
   - View the task details.
   - Delete the task.

### Phase III: AI Chatbot

1. **Chat Interface**:
   - On the Dashboard, click the **"Chat with AI"** button (or navigate to `/chat`).
2. **Commands**:
   - Type: _"Add a task to buy milk"_
     - **Expected**: AI confirms task creation. Check Dashboard to verify.
   - Type: _"What tasks do I have?"_
     - **Expected**: AI lists your pending tasks.
   - Type: _"Mark the milk task as complete"_
     - **Expected**: AI confirms completion.
3. **Context**:
   - Refresh the page.
   - Ask: _"What was the last thing I asked you to do?"_
     - **Expected**: AI remembers the previous conversation (history persisted in DB).

## Troubleshooting

- **Frontend Error "NextRouter was not mounted"**: Ensure you are not importing `next/router` in App Directory files. Use `next/navigation` instead.
- **Backend 401 Unauthorized**: Ensure your JWT token is valid (login again).
- **OpenAI Errors**: Verify `OPENAI_API_KEY` is correct in `backend/.env`.
- **Database Errors**: Ensure `DATABASE_URL` is correct and the database is accessible. Tables are auto-created on backend startup.
