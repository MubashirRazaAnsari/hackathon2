# Specify

## Feature: Phase V Advanced

### User Journeys

1. **Recurring Tasks**:
   - User adds a task with `is_recurring=true` and `pattern=daily`.
   - Task completion triggers new task creation.
2. **Prioritization**:
   - User views focused list of `priority=high` tasks.
3. **Notification**:
   - User receives hourly reminder for `due_date` within 24h.

### Requirements

- **US-501**: Priority & Tags (CRUD support).
- **US-502**: Recurring Tasks (Auto-regeneration).
- **US-503**: Notification Service (Event-driven alerts).
- **US-504**: Architecture (Kafka + Dapr + Kubernetes).

### Acceptance Criteria

- [x] Recurring tasks spawn next instance after completion.
- [x] Tasks can be filtered by priority.
- [x] Notification service logs reminder event.
- [x] All services deployed on Minikube and healthy.
