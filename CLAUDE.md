@AGENTS.md

# Common Commands

## Build

- Build all images: `./build_images.sh`
- Build specific backend: `docker build -t todo-backend:latest ./backend`

## Deploy (Minikube)

- Install Dapr: `dapr init -k`
- Install Kafka: `kubectl apply -f deploy/k8s/kafka-simple.yaml`
- Deploy App: `helm upgrade --install todo-app deploy/helm/todo-app -f deploy/helm/todo-app/values.yaml`

## Verification

- Connection check: `kubectl get pods`
- Logs (Backend): `kubectl logs -l component=backend -c backend`
- Logs (Notification): `kubectl logs -l component=notification -c notification`

## Testing

- Test notification event: `kubectl exec -it $(kubectl get pods -l component=notification -o name) -c notification -- python test_event.py`
