# Phase V Task Breakdown: Advanced Features & EDA

## Task List

### T-501: SQLModel & Schema Migration

- **Description**: Add priority, tags, due_date, and recurring fields to DB
- **Scope**: Update `models/task.py` and `migrate_db.py`. Run migration.
- **Status**: Completed

### T-502: API Enhancement (Filter/Sort)

- **Description**: Update Task API to support advanced queries
- **Scope**: Implement status filtering and sorting (priority/date) in `backend/api/tasks.py`.
- **Status**: Completed

### T-503: AI Tool Upgrades

- **Description**: Enable AI to handle Phase 5 fields
- **Scope**: Update `mcp_service/tools.py` and `api/chat.py` with new tool parameters.
- **Status**: Completed

### T-504: Premium Dashboard UI

- **Description**: Build the Phase 5 "Mission Control" interface
- **Scope**: Search bar, Filter dropdowns, and redesigned Task Cards.
- **Status**: Completed

### T-505: Dapr & Kafka Infrastructure

- **Description**: Configure K8s for Event-Driven Architecture
- **Scope**: Deploy Dapr components and Kafka broker. Update Helm charts.
- **Status**: Completed

### T-506: Recurring Task Service

- **Description**: Implement the auto-recurrence logic
- **Scope**: Create a microservice that subscribes to completion events and spawns next instances.
- **Status**: Pending

### T-507: Notification Service & Scheduling

- **Description**: Implement reminder logic
- **Scope**: Use Dapr Cron or Jobs to trigger notification events for upcoming tasks.
- **Status**: Pending

### T-508: Cloud CI/CD Pipeline

- **Description**: Automate deployment to managed Kubernetes
- **Scope**: Create GitHub Actions for build/push/deploy cycle.
- **Status**: Pending
