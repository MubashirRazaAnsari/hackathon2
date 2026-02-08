# Phase V Part C: Cloud Deployment Guide

This document provides step-by-step instructions to deploy the Todo Application to **Azure Kubernetes Service (AKS)** with **Dapr**, **Cloud Kafka**, and **CI/CD**.

## Prerequisites

- Azure Account (Free Trial ok)
- GitHub Account
- Terraform CLI installed
- Azure CLI (`az`) installed

## 1. Setup Infrastructure (Azure AKS)

We use Terraform to automate cluster creation.

1. **Login to Azure**:

   ```bash
   az login
   ```

2. **Run Terraform**:
   ```bash
   cd deploy/terraform
   terraform init
   terraform apply -auto-approve
   ```
   **Output**: This will output `kube_config` and `cluster_name`.
3. **Configure kubectl**:
   ```bash
   az aks get-credentials --resource-group todo-app-rg --name todo-app-cluster
   ```

## 2. Configure Cloud Components

### Kafka (Confluent Cloud)

1. Edit `deploy/k8s/components/pubsub-cloud.yaml`.
2. Replace `brokers`, `saslUsername`, `saslPassword` with your Confluent Cloud details.
3. Apply to cluster:
   ```bash
   kubectl apply -f deploy/k8s/components/pubsub-cloud.yaml
   ```

### Secrets

Create Kubernetes secrets for your API keys:

```bash
kubectl create secret generic todo-secrets \
  --from-literal=databaseUrl="<NEON_DB_URL>" \
  --from-literal=openaiApiKey="<OPENAI_KEY>" \
  --from-literal=betterAuthSecret="<SECRET>"
```

## 3. Setup CI/CD (GitHub Actions)

1. Go to **GitHub Repo > Settings > Secrets**.
2. Add the following secrets:
   - `AZURE_CREDENTIALS`: Output of `az ad sp create-for-rbac ...`
   - `AZURE_RG`: `todo-app-rg`
   - `AZURE_CLUSTER_NAME`: `todo-app-cluster`
   - `DATABASE_URL`: Your Neon DB URL
   - `OPENAI_API_KEY`: Your OpenAI Key
   - `BETTER_AUTH_SECRET`: Random string for Auth

3. Push code to `main`. The workflow `.github/workflows/deploy.yaml` will run automatically.

## 4. Enable Observability (Monitoring)

1. Run the installation script:
   ```bash
   ./deploy/scripts/install_monitoring.sh
   ```
2. Access Grafana:
   ```bash
   kubectl port-forward svc/prometheus-stack-grafana 3000:80 -n monitoring
   ```
   Visit `http://localhost:3000` (user: admin, pass: admin).

## 5. Verify Cloud Deployment

1. Get public IP:
   ```bash
   kubectl get svc -n ingress-nginx
   ```
2. Visit IP in browser.
3. Check Dapr Dashboard:
   ```bash
   dapr dashboard -k
   ```

---

**Status**: Ready for Execution.
All configuration files are present in the repository.
