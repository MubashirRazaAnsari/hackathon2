# Feature Specification: Notification Service

## Overview

A microservice that consumes task events and sends notifications for upcoming due dates, demonstrating event-driven architecture with Dapr.

## User Stories

### US-N01: Due Date Reminders

As a user, I want to receive notifications when my tasks are approaching their due dates, so I don't miss important deadlines.

### US-N02: Task Completion Notifications

As a user, I want to be notified when my recurring tasks are automatically created, so I'm aware of my upcoming obligations.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Backend API    │────▶│  Kafka Topic    │────▶│  Notification   │
│  (Producer)     │     │  "task.events"  │     │  Service        │
│                 │     │                 │     │  (Consumer)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                        ┌────────────────────────────────┘
                        │
                        ▼
                ┌─────────────────┐
                │  Dapr Cron      │
                │  Binding        │
                │  (Hourly Check) │
                └─────────────────┘
```

## Service Responsibilities

### 1. Event Consumer

- Subscribe to `task.completed` topic via Dapr Pub/Sub
- Log task completion events
- Track notification history in Dapr State

### 2. Reminder Scheduler

- Receive cron trigger every hour from Dapr Binding
- Query database for tasks with due dates in next 24 hours
- Send reminder notifications (console log for MVP)
- Store notification timestamp in Dapr State to avoid duplicates

### 3. Notification Handler

- Format notification messages
- Send via console output (extensible to email/SMS/push)
- Track delivery status

## Technical Specifications

### Service Configuration

- **App ID**: `notification`
- **Port**: 8002
- **Language**: Python FastAPI
- **Dapr Components Used**:
  - Pub/Sub (subscribe to events)
  - State Store (track sent notifications)
  - Cron Binding (scheduled checks)

### API Endpoints

#### POST /api/notifications/reminder-check

**Purpose**: Triggered by Dapr cron binding  
**Input**: Cron trigger payload  
**Output**: List of reminders sent

#### POST /task-completed (Dapr subscription)

**Purpose**: Receive task completion events  
**Input**: Task event from Kafka  
**Output**: Acknowledgment

#### GET /health

**Purpose**: Health check  
**Output**: `{"status": "healthy"}`

### Event Schemas

#### Task Completed Event (Input)

```json
{
  "id": "task-123",
  "user_id": "user-456",
  "title": "Daily Standup",
  "is_recurring": true,
  "recurrence_pattern": "daily",
  "completed_at": "2026-02-08T10:00:00Z"
}
```

#### Reminder Notification (Output)

```json
{
  "task_id": "task-789",
  "user_id": "user-456",
  "title": "Submit Report",
  "due_at": "2026-02-09T17:00:00Z",
  "message": "Reminder: 'Submit Report' is due tomorrow at 5:00 PM",
  "sent_at": "2026-02-08T15:00:00Z"
}
```

### State Management

#### Notification History Key Format

`notification:{user_id}:{task_id}:{due_date}`

#### State Value

```json
{
  "task_id": "task-789",
  "user_id": "user-456",
  "sent_at": "2026-02-08T15:00:00Z",
  "notification_type": "due_date_reminder"
}
```

## Acceptance Criteria

### AC-N01: Event Subscription

- GIVEN a task is marked complete
- WHEN the backend publishes a `task.completed` event
- THEN the notification service receives and logs the event

### AC-N02: Reminder Scheduling

- GIVEN tasks exist with due dates in the next 24 hours
- WHEN the cron binding triggers the reminder check
- THEN notifications are sent for each task
- AND duplicate notifications are prevented via state store

### AC-N03: State Persistence

- GIVEN a notification is sent
- WHEN the state is saved to Dapr
- THEN subsequent checks skip already-notified tasks

### AC-N04: Service Health

- GIVEN the notification service is running
- WHEN /health is called
- THEN it returns 200 OK

## Implementation Tasks

### T-N01: Service Scaffolding

- Create `services/notification_service/` directory
- Set up FastAPI application
- Configure Dapr annotations

### T-N02: Event Subscription

- Implement Dapr pub/sub subscription endpoint
- Handle `task.completed` events
- Log events to console

### T-N03: Cron Binding Handler

- Implement `/api/notifications/reminder-check` endpoint
- Query database for tasks due in 24 hours
- Send notifications via console

### T-N04: State Management

- Use Dapr state API to track sent notifications
- Implement duplicate prevention logic

### T-N05: Kubernetes Deployment

- Create Helm chart for notification service
- Add Dapr annotations to deployment
- Configure service and ingress

### T-N06: Testing

- Test event flow: Complete task → Event → Notification log
- Test cron trigger: Manual trigger → Reminder check
- Test state persistence: Verify no duplicate notifications

## Non-Functional Requirements

### Performance

- Process events within 1 second
- Handle up to 100 notifications per cron cycle

### Reliability

- Graceful degradation if Dapr is unavailable
- Retry failed notification sends (future enhancement)

### Observability

- Log all events received
- Log all notifications sent
- Expose metrics endpoint (future enhancement)

## Future Enhancements

- Email/SMS integration
- User notification preferences
- Notification templates
- Real-time push notifications via WebSocket
- Notification history API

---

**Status**: Implemented ✅ (Phase 5 Option 2)
**Deployed Version**: `todo-notification:latest`
**Service Endpoint**: `todo-app-notification:8002`
**Event Flow Verified**: Yes (via test script)
