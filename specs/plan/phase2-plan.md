# Phase II Plan: Multi-User Web Application with Persistence

## Overview
This plan outlines the implementation strategy for transforming the in-memory CLI todo application into a multi-user web application with persistent storage. The application will be built as a monorepo with a Next.js frontend and FastAPI backend.

## Architecture Strategy
### Monorepo Structure
```
project-root/
├── frontend/           # Next.js 16+ application
├── backend/            # FastAPI API server
└── shared/             # Shared types and utilities (optional)
```

### Technology Stack
- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS (basic styling allowed)
- **Backend**: FastAPI, Python 3.11+, SQLModel, Pydantic
- **Database**: Neon PostgreSQL (managed)
- **Authentication**: Better Auth with JWT
- **Deployment**: Vercel (frontend), Vercel Serverless Functions (backend)

## Backend Architecture
### FastAPI Server Structure
```
backend/
├── main.py                    # Main application entry point
├── config/                    # Configuration files
│   ├── database.py            # Database connection and settings
│   └── auth.py               # Authentication configuration
├── models/                    # SQLModel database models
│   ├── user.py               # User model
│   └── task.py               # Task model
├── schemas/                   # Pydantic schemas for API validation
│   ├── user.py               # User schemas
│   └── task.py               # Task schemas
├── api/                       # API route definitions
│   ├── auth.py               # Authentication routes
│   └── tasks.py              # Task routes
├── core/                      # Core application logic
│   ├── auth.py               # Authentication utilities
│   └── security.py           # Security utilities
└── utils/                     # Utility functions
```

### Database Schema
- **users table**: id, email, password_hash, created_at, updated_at
- **tasks table**: id, title, description, status, user_id (FK), created_at, completed_at
- Proper indexing on foreign keys and frequently queried fields
- Database migrations using Alembic

### API Design Principles
- RESTful API design with consistent endpoints
- Proper HTTP status codes
- Comprehensive request/response validation
- Error handling with consistent format
- JWT token validation on protected routes

## Frontend Architecture
### Next.js App Router Structure
```
frontend/
├── app/                       # App Router pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── auth/                 # Authentication pages
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── dashboard/page.tsx    # User dashboard
│   ├── tasks/                # Task management pages
│   │   ├── page.tsx          # Task list
│   │   ├── create/page.tsx   # Task creation
│   │   ├── [id]/page.tsx     # Task detail
│   │   └── [id]/edit/page.tsx # Task editing
│   └── globals.css           # Global styles
├── components/                # Reusable components
│   ├── ui/                   # Base UI components
│   ├── forms/                # Form components
│   └── layouts/              # Layout components
├── lib/                       # Utilities and libraries
│   ├── auth.ts               # Authentication utilities
│   ├── api.ts                # API client utilities
│   └── types.ts              # Type definitions
└── package.json              # Dependencies
```

### State Management Strategy
- Client-side state using React hooks (useState, useEffect, etc.)
- Server state using Next.js data fetching methods
- Authentication state management
- Form state for task creation/editing

### API Integration
- Custom hooks for API calls
- Interceptors for authentication headers
- Error handling and loading states
- TypeScript interfaces for API responses

## Authentication Implementation
### Better Auth Configuration
- User registration and login flows
- JWT token generation and validation
- Session management
- Protected route handling

### Frontend Authentication Flow
1. Check for existing authentication state on initial load
2. Redirect to auth pages if not authenticated (except for public routes)
3. Include JWT in API requests automatically
4. Handle token expiration and refresh

### Backend Authentication Flow
1. Validate JWT on protected endpoints
2. Extract user ID from token
3. Verify user exists and is active
4. Scope data operations to authenticated user

## Data Flow for Each Operation
### Task Creation Data Flow
1. Frontend: User fills task form and submits
2. Frontend: Validates form data client-side
3. Frontend: Sends POST request to `/api/tasks` with JWT header
4. Backend: Validates JWT and extracts user ID
5. Backend: Validates request body using Pydantic schema
6. Backend: Creates new task with user_id from JWT
7. Backend: Returns created task object
8. Frontend: Updates local state and shows success message

### Task Listing Data Flow
1. Frontend: Component mounts or refreshes
2. Frontend: Sends GET request to `/api/tasks` with JWT header
3. Backend: Validates JWT and extracts user ID
4. Backend: Queries tasks filtered by user_id
5. Backend: Returns list of user's tasks
6. Frontend: Renders task list component

### Task Update Data Flow
1. Frontend: User modifies task and saves
2. Frontend: Validates form data client-side
3. Frontend: Sends PUT request to `/api/tasks/{id}` with JWT header
4. Backend: Validates JWT and extracts user ID
5. Backend: Verifies task belongs to authenticated user
6. Backend: Updates task with new data
7. Backend: Returns updated task object
8. Frontend: Updates local state and shows success message

### Task Deletion Data Flow
1. Frontend: User clicks delete button
2. Frontend: Shows confirmation dialog
3. Frontend: Sends DELETE request to `/api/tasks/{id}` with JWT header
4. Backend: Validates JWT and extracts user ID
5. Backend: Verifies task belongs to authenticated user
6. Backend: Deletes task from database
7. Backend: Returns success confirmation
8. Frontend: Updates local state and shows success message

## Security Implementation
### Authentication Security
- Password hashing using bcrypt or similar
- JWT signing with strong algorithms
- Token expiration and refresh mechanisms
- Secure cookie handling (if applicable)

### Authorization Security
- Row-level security ensuring users can only access their own data
- Input validation on all API endpoints
- SQL injection prevention through ORM usage
- Proper error message sanitization

### Data Security
- HTTPS enforcement in production
- CORS policy configuration
- Rate limiting (basic implementation)
- Input sanitization for all user inputs

## Environment Configuration
### Required Environment Variables
#### Backend
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT secret key for token signing
- `BETTER_AUTH_SECRET` - Better Auth secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

#### Frontend
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_AUTH_URL` - Authentication service URL

### Configuration Strategy
- Separate environment files for dev, staging, prod
- Proper secret management for deployment platforms
- Consistent variable naming across frontend and backend

## Deployment Strategy
### Frontend Deployment
- Deploy to Vercel with automatic builds
- Environment variables configured in Vercel dashboard
- Custom domain setup
- SSL certificate configuration

### Backend Deployment
- Deploy to Vercel as Serverless FastAPI functions
- Environment variables configured in Vercel dashboard
- Database connection configuration
- Health check endpoints

### Database Setup
- Neon PostgreSQL database provisioning
- Connection pooling configuration
- Backup and maintenance settings
- Security configurations

## Testing Strategy
### Backend Testing
- Unit tests for API endpoints
- Integration tests for database operations
- Authentication flow testing
- Error handling verification

### Frontend Testing
- Component testing with Jest/Testing Library
- API integration testing
- Authentication flow testing
- Form validation testing

## Error Handling Strategy
### Backend Error Handling
- Consistent error response format
- Proper HTTP status codes
- Validation error aggregation
- Logging for debugging

### Frontend Error Handling
- User-friendly error messages
- Loading and error states for all async operations
- Network error handling
- Form validation error display

## Performance Considerations
### Backend Performance
- Database query optimization
- Connection pooling
- Caching for frequently accessed data
- Pagination for large datasets

### Frontend Performance
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Efficient state updates

## Migration from Phase I
### Data Model Evolution
- Add user_id field to tasks
- Preserve existing task attributes
- Maintain CRUD operation semantics
- Add user scoping to all operations

### Functionality Mapping
- CLI commands → Web API endpoints
- In-memory storage → Database storage
- Single-user → Multi-user with scoping
- Local state → Persistent state

## Monitoring and Maintenance
### Backend Monitoring
- Request logging
- Error tracking
- Performance metrics
- Database query monitoring

### Frontend Monitoring
- Client-side error logging
- Performance monitoring
- User interaction tracking
- API response time monitoring

## Dependencies and Constraints
### Technical Constraints
- Must use Next.js 16+ with App Router
- Must use FastAPI with SQLModel
- Must use Neon PostgreSQL
- Must use Better Auth for authentication
- Frontend must deploy to Vercel

### Dependency Management
- Keep dependencies up to date
- Security vulnerability scanning
- Regular dependency audits
- Consistent version management

## Risk Mitigation
### Technical Risks
- Database connection failures
- Authentication system failures
- Performance degradation
- Security vulnerabilities

### Mitigation Strategies
- Comprehensive error handling
- Proper monitoring and alerts
- Regular security audits
- Performance testing