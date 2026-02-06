# Phase II: Multi-User Web Application with Persistence

This repository contains the implementation of Phase II: a multi-user web application with persistent storage built as a monorepo with Next.js frontend and FastAPI backend.

## Architecture

- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with SQLModel ORM, Python 3.11+
- **Database**: Neon PostgreSQL (managed)
- **Authentication**: JWT-based authentication with custom implementation
- **Deployment**: Vercel (frontend and serverless backend functions)

## Environment Variables

### Backend
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT secret key for token signing
- `BETTER_AUTH_SECRET` - Better Auth secret key (placeholder)
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

### Frontend
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL

## Project Structure

```
project-root/
├── frontend/           # Next.js 16+ application
├── backend/            # FastAPI API server
└── package.json        # Monorepo root configuration
```

## Running the Application

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables using `.env.example` as template
4. Run the server: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Set up environment variables using `.env.local.example` as template
4. Run the development server: `npm run dev`

## Features

- User authentication (registration and login)
- JWT-based secure API access
- Task CRUD operations (Create, Read, Update, Delete)
- Task completion marking
- User-scoped data isolation
- Responsive UI with Tailwind CSS

## Deployment

The application is configured for deployment to Vercel:
- Frontend deploys as a standard Next.js application
- Backend deploys as serverless functions on Vercel