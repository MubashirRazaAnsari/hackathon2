# Plan

## Architecture (Cloud Native Todo)

### Components

1. **Frontend**: Next.js (port 3000)
2. **Backend**: FastAPI (port 8000)
3. **Recurring Engine**: FastAPI + Dapr PubSub
4. **Notification**: FastAPI + Dapr Bindings
5. **Infrastructure**: Kafka, Redis (optional), Neon DB (external)

### Event Flow (Architecture)

- **Task Completed**: Backend → Dapr PubSub → Kafka → Recurring Engine & Notification Service
- **Reminders**: Dapr Cron Binding (Scheduling) → Notification Service

### Detailed Design

- **Database**:
  - `Task` model extended with `is_recurring`, `priority`, `due_date`.
  - `Notification` model for tracking sent reminders.
- **Service Interfaces**:
  - `POST /api/tasks` (Create)
  - `PATCH /api/tasks/{id}/complete` (Trigger)
  - `@dapr_app.subscribe("task.completed")` (Consumer)
