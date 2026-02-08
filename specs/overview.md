# Project Overview: Tactical Todo Evolution

## Mission Summary

A multi-phase evolution of a task management system, transitioning from a humble Python CLI to a cloud-native, AI-powered, event-driven ecosystem.

## Technical Arsenal

- **Frontend**: Next.js 15, Tailwind CSS, Lucide React.
- **Backend**: FastAPI, SQLModel, Uvicorn.
- **Identity**: Better Auth (Integrated with Postgres).
- **Persistence**: Neon PostgreSQL (Serverless).
- **Intelligence**: OpenAI SDK (OpenRouter backend) with support for tool-calling and fallback parsing.
- **Cloud**: Docker, Kubernetes (Minikube/GKE), Helm.
- **EDA**: Dapr, Kafka (Phase 5).

## Operational Phases

### Phase I: The Seed

- **Artifact**: Python CLI application.
- **Focus**: Core logic and in-memory state management.

### Phase II: The Web Transition

- **Artifact**: Full-stack Next.js/FastAPI application.
- **Focus**: Transition to multi-user web access with Better Auth and Neon Postgres.

### Phase III: The Intelligence Layer

- **Artifact**: AI Tactical Assistant.
- **Focus**: Integration of an AI agent via MCP-like tools, capable of managing tasks through natural language.

### Phase IV: Containerized Fleet

- **Artifact**: Orchestrated Kubernetes Deployment.
- **Focus**: Scalability and infrastructure-as-code using Helm and Minikube.

### Phase V: Event-Driven Autonomy (Active)

- **Artifact**: Distributed Microservices Architecture.
- **Focus**: Task priorities, tags, recurrence, and event-driven triggers via Dapr and Kafka.

## Strategic Guidelines

- **Approach**: Strict Spec-Driven Development (SDD).
- **Governance**: Defined in `specs/constitution.md`.
- **History Tracking**: Maintained in `specs/history.md`.
