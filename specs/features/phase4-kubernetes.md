# Phase IV Specification: Local Kubernetes Deployment

## Overview

Phase IV transforms the current monorepo application into a cloud-native system by containerizing its components and deploying them to a local Kubernetes cluster (Minikube). This phase focuses on infrastructure-as-code using Helm charts and AI-assisted DevOps workflows.

## User Stories

### US-401: Standardized Containerization

As a developer, I want to have Docker images for both the frontend and backend so that I can ensure environment parity across different deployment targets.

### US-402: Automated Orchestration

As an operator, I want to use Helm charts to manage the deployment of the entire application stack so that I can easily scale, update, and manage the lifecycle of my services.

### US-403: Local Cloud Simulation

As a system architect, I want to run the application in a local Kubernetes environment (Minikube) to validate the cloud-native behavior before pushing to a production cloud provider.

## Architecture

- **Cluster**: Minikube (Local Kubernetes).
- **Frontend Service**: Next.js application running in a Docker container.
- **Backend Service**: FastAPI application running in a Docker container.
- **Database**: External Neon PostgreSQL (remains external for persistence validation).
- **Ingress**: NGINX Ingress Controller to route traffic to the appropriate services.
- **Configuration**: Kubernetes Secrets/ConfigMaps managed via Helm.

## Infrastructure Components

### 1. Docker Images

- **Backend Image**: Based on `python:3.11-slim`, installs dependencies, and runs Uvicorn.
- **Frontend Image**: Based on `node:20-alpine`, builds the Next.js app, and serves it.

### 2. Helm Chart Structure

`deploy/helm/todo-app/`

- `Chart.yaml`: Metadata.
- `values.yaml`: Default configuration (replicas, image tags, env vars).
- `templates/`:
  - `backend-deployment.yaml`
  - `backend-service.yaml`
  - `frontend-deployment.yaml`
  - `frontend-service.yaml`
  - `ingress.yaml`
  - `secrets.yaml`

## Environment Variables Mapping

| Variable           | Source    | Destination      |
| ------------------ | --------- | ---------------- |
| DATABASE_URL       | Secret    | Backend/Frontend |
| BETTER_AUTH_SECRET | Secret    | Backend/Frontend |
| BETTER_AUTH_URL    | ConfigMap | Frontend         |
| OPENAI_API_KEY     | Secret    | Backend          |
| OPENAI_BASE_URL    | ConfigMap | Backend          |

## Acceptance Criteria

### AC-401: Successful Image Build

- Both frontend and backend Dockerfiles must build successfully without errors.
- Images should be optimized for size (using multi-stage builds).

### AC-402: Helm Deployment

- `helm install todo-app ./deploy/helm/todo-app` must deploy all components.
- All pods must reach `Running` state.
- Backend should successfully connect to the existing Neon database from within the cluster.

### AC-403: Traffic Routing

- Accessing the configured Minikube IP/domain should route to the Next.js frontend.
- Frontend should be able to communicate with the Backend service via internal DNS (e.g., `http://backend-service:8000`).

## Explicit Non-Goals

- No horizontal pod autoscaling (HPA) in this phase.
- No managed Kubernetes in the cloud (reserved for Phase V).
- No specialized observability stack (Prometheus/Grafana) yet.
- Database remains external (Neon) and is not deployed inside the cluster.
