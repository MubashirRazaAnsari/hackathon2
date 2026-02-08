terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "todoapp-k8s"

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = "Standard_B2s" # Cost-effective for hackathon
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Production"
    Project     = "TodoApp-Phase5"
  }
}

# Install Dapr on AKS via Helm
resource "helm_release" "dapr" {
  name       = "dapr"
  repository = "https://dapr.github.io/helm-charts/"
  chart      = "dapr"
  namespace  = "dapr-system"
  create_namespace = true

  set {
    name  = "global.mtls.enabled"
    value = "true"
  }
}

# Install NGINX Ingress Controller
resource "helm_release" "ingress" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"
  create_namespace = true
}

output "kube_config" {
  value     = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive = true
}
output "cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}
output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}
