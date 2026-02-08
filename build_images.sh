#!/bin/bash
eval $(minikube docker-env)
docker build -t todo-backend:latest ./backend
docker build -t todo-recurring:latest ./services/recurring_engine
docker build -t todo-notification:latest ./services/notification_service
