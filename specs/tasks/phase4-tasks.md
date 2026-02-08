# Phase IV Task Breakdown: Local Kubernetes Deployment

## Task List

### T-401: Backend Containerization

- **Description**: Create specialized Dockerfile for FastAPI
- **Scope**: Multi-stage build (if beneficial) or slim prod image. Include `libpq-dev` for Postgres.
- **Artifacts**: `backend/Dockerfile`, `backend/.dockerignore`

### T-402: Frontend Containerization

- **Description**: Create multi-stage Dockerfile for Next.js
- **Scope**: Builder stage for `npm run build`, Runner stage for production server.
- **Artifacts**: `frontend/Dockerfile`, `frontend/.dockerignore`

### T-403: Helm Chart Foundation

- **Description**: Initialize the Helm chart structure
- **Scope**: Run `helm create` (or manual setup) and define `Chart.yaml`.
- **Artifacts**: `deploy/helm/todo-app/Chart.yaml`

### T-404: Kubernetes Templates (Backend)

- **Description**: Define K8s Deployment and Service for the API
- **Scope**: Map secrets from environment/values to Pod environment variables.
- **Artifacts**: `deployment-backend.yaml`, `service-backend.yaml`

### T-405: Kubernetes Templates (Frontend)

- **Description**: Define K8s Deployment and Service for the Web UI
- **Scope**: Configure `NEXT_PUBLIC_` variables to point to the backend service.
- **Artifacts**: `deployment-frontend.yaml`, `service-frontend.yaml`

### T-406: Ingress Configuration

- **Description**: Setup NGINX Ingress rules
- **Scope**: Map `todo.local/` to frontend and `todo.local/api/` to backend.
- **Artifacts**: `ingress.yaml`

### T-407: Local Deployment & Orchestration

- **Description**: Perform the initial cluster-wide deployment
- **Scope**: Use `helm install` to deploy all components to Minikube.
- **Artifacts**: Running K8s Pods

### T-408: Final Validation & Connectivity

- **Description**: Verify end-to-end functionality in the cluster
- **Scope**: Test Login/Signup, Task CRUD, and AI Chat through the `todo.local` domain.
