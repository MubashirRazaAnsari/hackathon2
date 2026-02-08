# Phase IV Implementation Plan: Local Kubernetes Deployment

## Phase Overview

Transition from bare-metal/WSL execution to a containerized, orchestrated environment using Docker, Minikube, and Helm.

## Architecture & Infrastructure

- **Containerization**: Multi-stage Docker builds for Frontend (Next.js) and Backend (FastAPI).
- **Cluster**: Minikube with NGINX Ingress Controller.
- **Orchestration**: Helm Charts for stateful/stateless component management.
- **Persistence**: External Neon Postgres (remains external for this phase).

## Implementation Steps

### 1. Preparation & Containerization

- **Backend**: Create a Dockerfile based on `python:3.11-slim`. Optimize with `.dockerignore`.
- **Frontend**: Create a multi-stage Dockerfile for Next.js (`npm install` -> `npm run build` -> `npm start`).
- **Validation**: Build and run both locally using `docker run` to verify production environment variables.

### 2. Helm Chart Architecture

- Define a base chart `todo-app`.
- Implement `templates/` for:
  - `backend-deployment.yaml` & `backend-service.yaml`
  - `frontend-deployment.yaml` & `frontend-service.yaml`
  - `ingress.yaml` (routing `todo.local` -> Frontend, `/api` -> Backend)
- Use `values.yaml` for environment-specific configuration.

### 3. Local Cluster Deployment

- Start Minikube.
- Enable `ingress` addon.
- Configure `minikube docker-env` to build images directly into the cluster.
- Execute `helm install` with required secrets (Database URL, OpenAI Key).

### 4. Networking & Access

- Configure Windows/WSL `hosts` file to map `todo.local` to `minikube ip`.
- Verify cross-container communication (Frontend reaching Backend via K8s Service DNS).

## Risks & Mitigation

- **Resource Constraints**: Minikube consumes significant RAM. Mitigation: Use `--memory` flag during start.
- **Image Pull Issues**: K8s by default pulls from registries. Mitigation: Set `imagePullPolicy: IfNotPresent` and use local Minikube Docker daemon.
- **Ingress Mapping**: Routing can be tricky with path prefixes. Mitigation: Use specific NGINX rewrite-target if needed.
