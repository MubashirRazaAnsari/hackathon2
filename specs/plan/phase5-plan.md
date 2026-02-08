# Phase V Implementation Plan: Advanced Features & EDA

## Phase Overview

Evolution of the application into a professional productivity suite with an event-driven core using Dapr and Kafka.

## Implementation Steps

### 1. Advanced Organizational Features (Phase 5a)

- **Model Refactoring**: Update SQLModel `Task` with `priority`, `tags`, `due_date`, and `recurrence` fields.
- **Migration**: Update `migrate_db.py` to add new columns to the existing Neon Postgres table.
- **API Enhancement**: Update `/api/tasks` GET to support `?status=...&sort=...`.
- **UI Upgrade**: Implement the new "Mission Control" dashboard with real-time search/filter/sort.

### 2. Event-Driven Core (Phase 5b)

- **Dapr Integration**: Add Dapr annotations to K8s deployments.
- **Messaging (Kafka)**: Deploy or connect to a Kafka broker. Configure Dapr Pub/Sub component.
- **Recurring Task Engine**: Create a small service that subscribes to `task.completed` and emits new tasks if `is_recurring` is true.

### 3. Intelligence & Reminders (Phase 5c)

- **Notification Service**: Implementation of a service that listens for task reminders.
- **Dapr Jobs**: Utilize Dapr's scheduling capabilities for future notification events.

### 4. Production Deployment (Phase 5d)

- **Managed K8s**: Transition from Minikube to a cloud provider (GKE/AKS/EKS).
- **CI/CD**: Implementation of GitHub Actions for automated deployment.

## Architecture

- **Pub/Sub**: Dapr abstraction over Kafka.
- **Services**: Polyglot microservices (Main API + Recurring Engine + Notifications).
