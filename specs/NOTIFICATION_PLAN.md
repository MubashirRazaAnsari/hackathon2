# Implementation Plan: Notification Service

## Phase 1: Service Foundation ✅

- [x] Write specification (@specs/features/notification-service.md)
- [ ] Create service directory structure
- [ ] Set up Python dependencies
- [ ] Create Dockerfile

## Phase 2: Core Service Implementation

- [ ] Implement FastAPI application
- [ ] Add health check endpoint
- [ ] Configure Dapr client integration
- [ ] Add database connection

## Phase 3: Event Subscription

- [ ] Implement Dapr pub/sub subscription
- [ ] Create task.completed event handler
- [ ] Add event logging
- [ ] Test event flow

## Phase 4: Reminder Scheduler

- [ ] Implement cron binding endpoint
- [ ] Add database query for upcoming tasks
- [ ] Create notification formatter
- [ ] Implement Dapr state management for deduplication

## Phase 5: Kubernetes Deployment

- [ ] Create Helm deployment template
- [ ] Create Helm service template
- [ ] Update Helm values.yaml
- [ ] Build Docker image
- [ ] Deploy to Minikube

## Phase 6: Integration Testing

- [ ] Test: Complete task → Event received
- [ ] Test: Cron trigger → Reminders sent
- [ ] Test: State persistence → No duplicates
- [ ] Test: Service restart → State retained

## Testing Checkpoints

### Checkpoint 1: Service Starts

```bash
cd services/notification_service
uvicorn main:app --reload --port 8002
# Expected: Server starts on port 8002
```

### Checkpoint 2: Health Check

```bash
curl http://localhost:8002/health
# Expected: {"status": "healthy"}
```

### Checkpoint 3: Event Subscription

```bash
# Complete a task via API
# Expected: Notification service logs event
```

### Checkpoint 4: Cron Trigger

```bash
# Trigger cron manually via Dapr
curl -X POST http://localhost:8002/api/notifications/reminder-check
# Expected: Reminders logged for tasks due in 24h
```

### Checkpoint 5: Kubernetes Deployment

```bash
kubectl get pods -l component=notification
# Expected: Pod running with 2/2 containers (app + daprd)
```

---

**Current Phase**: Phase 1 ✅  
**Next Step**: Create service directory structure
