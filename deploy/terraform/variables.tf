variable "resource_group_name" {
  default = "todo-app-rg"
}
variable "location" {
  description = "The Azure region for deployment"
  default     = "eastus2"
}
variable "cluster_name" {
  default = "todo-app-cluster"
}
variable "node_count" {
  default = 2
}
