# Phase V Specification: Advanced Features & Event-Driven Architecture

## Overview

Phase V represents the final evolution of the Todo application. It introduces advanced organizational features, intelligent scheduling (recurring tasks/reminders), and a professional event-driven architecture using Kafka and Dapr. The system will be deployed to a production-grade managed Kubernetes cluster.

## User Stories

### US-501: Organizational Mastery

As a power user, I want to use priorities, tags, and advanced search/filtering to manage a high volume of tasks efficiently.

### US-502: Intelligent Scheduling

As a busy user, I want to set due dates and have tasks auto-reschedule (recurring tasks) so I don't have to manually manage my routine.

### US-503: Event-Driven Reminders

As a forgetful user, I want to receive notifications for upcoming tasks, powered by a decoupled notification service.

### US-504: Distributed Runtime (Dapr)

As a developer, I want to use Dapr to abstract my infrastructure (state, pub/sub, secrets) so that the application is truly cloud-agnostic.

## Architecture

- **Messaging**: Kafka (via Dapr Pub/Sub) for inter-service communication.
- **Runtime**: Dapr sidecars for state management and event-driven triggers.
- **Service A**: Main Todo/Chat API (FastAPI).
- **Service B**: Notification Service (Python/FastAPI) - listens for "reminder" events.
- **Service C**: Recurring Task Engine (Python/FastAPI) - creates next instances of completed recurring tasks.
- **CI/CD**: GitHub Actions for automated building, testing, and deployment to GKE/AKS.

## Domain Model Updates

### Task (Extended)

- **priority** (string): "low", "medium", "high"
- **tags** (array): List of category strings
- **due_date** (datetime, optional)
- **is_recurring** (boolean)
- **recurrence_pattern** (string, optional): e.g., "daily", "weekly"
- **last_notified_at** (datetime, optional)

## Feature Implementation Strategy

### 1. Intermediate Search & Filter

- Backend: Multi-parameter query support in `/api/tasks`.
- Frontend: Advanced filter bar and sort controls.

### 2. Event System (Kafka + Dapr)

- When a task is completed, an event `task.completed` is published.
- The `Recurring Service` subscribes to `task.completed`, checks if `is_recurring` is true, and creates the next task.

### 3. Reminders (Dapr Jobs)

- Use Dapr Jobs API to schedule callbacks for task due dates.
- Callback triggers a notification event.

## Acceptance Criteria

### AC-501: Organizational Tools

- Search results must update in real-time or upon submission.
- Tasks must be sortable by priority and due date.

### AC-502: Recurring Tasks

- Given a task marked as "Daily Recurring", when it is marked complete, then a new task with the same title must be created with a due date of Tomorrow.

### AC-503: Dapr Integration

- State must be saved/retrieved via the Dapr state management API.
- Inter-service communication must use the Dapr service invocation API.

### AC-504: CI/CD Pipeline

- Every push to `main` must trigger a Docker build and push to a Container Registry.
- Deployment to the cloud cluster must be automated via Helm in the pipeline.

## Explicit Non-Goals

- No mobile application (Mobile-responsive web is the focus).
- No complex multi-tenant analytics dashboard.
