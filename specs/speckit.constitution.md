# Constitution

## Core Principles

1. **Spec-Driven**: No code without a spec. Update specs before implementation.
2. **Cloud-Native**: Design for Kubernetes, containerization, and horizontal scaling.
3. **Event-Driven**: Use Kafka/Dapr for inter-service communication; avoid tight coupling.
4. **Stateless**: Services should be stateless where possible; use external stores (DB/Redis).
5. **Security First**: No hardcoded secrets; use Dapr secret store or K8s secrets.

## Technology Constraints

- **Language**: Python 3.11+, TypeScript (Frontend).
- **Frameworks**: FastAPI, Next.js, SQLModel.
- **Infrastructure**: Kubernetes, Heim, Dapr.

## Coding Standards

- Use Type Hints in Python.
- Follow PEP 8.
- Use Async/Await for I/O operations.
- All public APIs must have OpenAPI docs (FastAPI default).
