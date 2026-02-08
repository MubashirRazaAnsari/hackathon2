#!/bin/bash
set -e

# Add Prometheus Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create namespace for monitoring
kubectl create namespace monitoring || true

# Install Prometheus/Grafana stack
helm upgrade --install prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.adminPassword=admin

# Apply Dapr Dashboard configuration (optional)
# This requires fetching dashboard JSON first

echo "Monitoring stack installed!"
echo "Access Grafana:"
echo "kubectl port-forward svc/prometheus-stack-grafana 3000:80 -n monitoring"
echo "Login: admin / admin"
