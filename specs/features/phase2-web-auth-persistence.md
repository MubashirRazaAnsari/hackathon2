# Phase II Specification: Multi-User Web Application with Persistence

## Overview
Phase II transforms the in-memory CLI todo application into a multi-user web application with persistent storage. The application will be built as a monorepo with a Next.js frontend and FastAPI backend, featuring user authentication and secure data persistence.

## Architecture
- **Frontend**: Next.js 16+ application using App Router
- **Backend**: FastAPI API server with SQLModel ORM
- **Database**: Neon PostgreSQL managed database
- **Authentication**: Better Auth integration
- **Deployment**: Frontend to Vercel, Backend to appropriate hosting platform

## User Authentication
### User Registration
- Email and password registration
- Email verification (optional in Phase II)
- Password strength requirements
- Unique email validation

### User Login
- Secure login with email/password
- JWT token generation and validation
- Session management through Better Auth
- Automatic token refresh

### User Scoping
- All todo operations must be scoped to authenticated user
- Users cannot access other users' todos
- Data isolation at the database level

## Domain Model: Task
### Attributes
- **id** (integer, required): Unique identifier for the task, auto-generated
- **title** (string, required): Title of the task, maximum 200 characters
- **description** (string, optional): Detailed description of the task, maximum 1000 characters
- **status** (string, required): Current status of the task, one of: "pending", "completed"
- **user_id** (string, required): Foreign key linking to the user who owns the task
- **created_at** (datetime, required): Timestamp when the task was created
- **completed_at** (datetime, optional): Timestamp when the task was marked as completed

### Constraints
- Task title must not be empty or contain only whitespace
- Task status must be one of the allowed values: "pending", "completed"
- Task must belong to an authenticated user
- Task ID must be unique within the application
- Task title must not exceed 200 characters
- Task description must not exceed 1000 characters

## Web API Endpoints
### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user info

### Task Endpoints
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task for authenticated user
- `GET /api/tasks/{id}` - Get a specific task for authenticated user
- `PUT /api/tasks/{id}` - Update a specific task for authenticated user
- `DELETE /api/tasks/{id}` - Delete a specific task for authenticated user
- `PATCH /api/tasks/{id}/complete` - Mark a task as completed for authenticated user

## Frontend Pages and Components
### Authentication Pages
- `/auth/signin` - User login page
- `/auth/signup` - User registration page
- `/auth/forgot-password` - Password reset page

### Task Management Pages
- `/dashboard` - User dashboard showing tasks
- `/tasks` - Main tasks page with CRUD operations
- `/tasks/[id]` - Individual task view page
- `/tasks/create` - Task creation form
- `/tasks/[id]/edit` - Task editing form

### Layout Components
- Navigation bar with user menu
- Task list component
- Task form component
- Loading and error states

## User Experience Flow
1. User visits the application homepage
2. If not authenticated, redirected to signup/login
3. After authentication, user lands on dashboard
4. User can create, view, update, and delete tasks
5. All tasks are isolated to the authenticated user
6. User can log out and session ends

## Security Requirements
- JWT tokens must be validated on all protected routes
- All API endpoints must verify user ownership of data
- Passwords must be securely hashed
- Sensitive data must not be exposed in client-side code
- CORS policies must be properly configured

## Data Persistence
- All tasks must be persisted in Neon PostgreSQL database
- User data must be persisted in Neon PostgreSQL database
- Data relationships must be properly maintained
- Data integrity constraints must be enforced at the database level

## Deployment Requirements
- Frontend deployed to Vercel with public URL
- Backend deployed to appropriate hosting platform
- Database hosted on Neon PostgreSQL
- Environment variables properly configured for each environment
- SSL/TLS certificates properly configured

## Acceptance Criteria
### AC-001: User Registration
- Given a visitor to the site, when they register with valid email and password, then they should be able to access the application
- Given a user with existing account, when they try to register with the same email, then they should receive an appropriate error message

### AC-002: User Authentication
- Given an unauthenticated user, when they try to access protected pages, then they should be redirected to login
- Given an authenticated user, when they access protected pages, then they should be allowed access
- Given an authenticated user, when their session expires, then they should be redirected to login

### AC-003: Task Management
- Given an authenticated user, when they create a task, then it should be saved to their account and not accessible to others
- Given an authenticated user with tasks, when they view their tasks, then they should only see their own tasks
- Given an authenticated user with tasks, when they try to access another user's task, then they should receive an appropriate error

### AC-004: Task CRUD Operations
- Given an authenticated user with tasks, when they update a task, then the changes should be persisted
- Given an authenticated user with tasks, when they delete a task, then it should be removed from their account
- Given an authenticated user with tasks, when they mark a task as complete, then the status should be updated with timestamp

## Explicit Non-Goals (What Phase II Must NOT Include)
### Styling and UI/UX
- No custom CSS frameworks
- No advanced styling beyond basic functionality
- No animations or transitions
- No responsive design beyond basic layout

### Authentication Extensions
- No OAuth providers (Google, Facebook, etc.)
- No social login integration
- No password recovery via email
- No two-factor authentication

### Advanced Features
- No role-based access control
- No admin panels
- No task categorization
- No due dates or scheduling
- No notifications
- No bulk operations
- No import/export capabilities

### Performance Optimizations
- No caching mechanisms
- No performance tuning beyond basic implementation
- No optimization for large datasets

### Advanced Security
- No rate limiting
- No brute force protection beyond basic measures
- No advanced audit logging

### Infrastructure
- No CI/CD pipelines
- No automated testing infrastructure
- No monitoring or alerting
- No backup strategies beyond database provider defaults