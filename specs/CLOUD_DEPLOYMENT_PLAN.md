# Cloud Deployment Plan (Phase V - Part C)

## Overview

This document outlines the strategy for migrating the Todo Application from a local Minikube environment to a production-grade Kubernetes cluster on Google Kubernetes Engine (GKE) or Azure Kubernetes Service (AKS).

## Objectives

1. **Production Readiness**: Scalable, reliable, and secure deployment.
2. **Automation**: CI/CD pipelines for code delivery.
3. **Observability**: comprehensive logging and monitoring.

## 1. Infrastructure as Code (Terraform)

### GKE Cluster Provisioning

- **VPC Network**: Dedicated VPC for isolation.
- **Subnets**: Private subnets for nodes, public for load balancers.
- **Node Pools**:
  - `default-pool`: 2x e2-medium (System components)
  - `app-pool`: 3x e2-standard-2 (Application workloads)
- **Security**: IAM roles, Workload Identity.

### Dapr Installation

- Install Dapr via Helm chart.
- Enable mutual TLS (mTLS) for all sidecar communication.
- Configure tracing with Zipkin/Jaeger.

### Messaging (Kafka)

- **Option A (Managed)**: Confluent Cloud (Recommended for strict SLAs).
- **Option B (Self-Hosted)**: Strimzi Operator on GKE (Cost-effective for hackathon).
  - Deploy Strimzi Cluster Operator.
  - Create Kafka Cluster CRD.

## 2. CI/CD Pipeline (GitHub Actions)

### Workflow: `build-and-deploy.yaml`

#### Triggers

- Push to `main` branch.
- Pull Requests (Build/Test only).

#### Jobs

1. **Test**:
   - Run unit tests (Pytest).
   - Linting (Ruff/Black).
2. **Build**:
   - Build Docker images for Backend, Frontend, Recurring, Notification.
   - Tag with generic `commit-sha`.
   - Push to Google Artifact Registry (GAR).
3. **Deploy (Staging)**:
   - Update Helm chart values with new image tags.
   - `helm upgrade --install todo-staging ...`
4. **Deploy (Production)**:
   - Manual approval gate.
   - `helm upgrade --install todo-prod ...`

## 3. Observability Strategy

### Logging

- **Fluent Bit**: Collect logs from all pods.
- **Google Cloud/Azure Monitor**: Centralized log storage.

### Metrics

- **Prometheus**: Scrape metrics from Dapr sidecars and application endpoints (`/metrics`).
- **Grafana**: Dashboards for:
  - Request Rate/Latency/Error Rate (RED).
  - Pub/Sub Lag.
  - Resource Usage (CPU/Memory).

### Tracing

- **OpenTelemetry**: Dapr handles tracing automatically.
- **Jaeger/Zipkin**: visualize trace spans across microservices.

## 4. Security Enhancements

- **Secrets Management**: Move from Helm values to External Secrets Operator (ESO) syncing with Google Secret Manager.
- **Network Policies**: Restrict traffic between namespaces.
- **Ingress Controller**: Upgrade to NGINX Ingress with cert-manager for automatic Let's Encrypt SSL certificates.

## 5. Migration Steps

1. **Pre-requisites**:
   - Create Google Cloud Project.
   - Enable Kubernetes Engine API, Artifact Registry API.
2. **Cluster Setup**:
   - Run Terraform apply.
3. **Data Migration**:
   - Neon DB is already cloud-native; no migration needed.
   - Verify connectivity from GKE to Neon.
4. **Deployment**:
   - Configure GitHub Secrets.
   - Trigger initial workflow run.
5. **DNS Switchover**:
   - Update `todo.yourdomain.com` A record to GKE Load Balancer IP.

## 6. Cost Estimation (Monthly)

| Service                    | Tier           | Est. Cost   |
| -------------------------- | -------------- | ----------- |
| GKE Management             | Free (zonal)   | $0          |
| Compute (e2-standard-2 x3) | Spot Instances | ~$40        |
| Load Balancer              | Regional       | ~$18        |
| Artifact Registry          | Standard       | <$1         |
| Monitoring                 | Basic          | Free tier   |
| **Total**                  |                | **~$60/mo** |

---

**Status**: Planning Phase  
**Next Action**: Implement Terraform scripts
