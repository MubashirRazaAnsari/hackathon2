import httpx
import asyncio
import os
import json
from datetime import datetime

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500") # Might need to forward this port locally
PUBSUB_NAME = "pubsub"
TOPIC_NAME = "task.completed"

async def publish_test_event():
    print(f"Publishing test event to {TOPIC_NAME}...")
    try:
        async with httpx.AsyncClient() as client:
            # We'll need to port-forward the dapr sidecar of the notification service to hit it locally
            # Or exec into the pod. Let's assume we exec into the pod for this test.
            url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/publish/{PUBSUB_NAME}/{TOPIC_NAME}"
            payload = {
                "id": "test-task-1",
                "user_id": "test-user",
                "title": "Test Recurring Task Completion",
                "is_recurring": True,
                "recurrence_pattern": "daily",
                "completed_at": datetime.utcnow().isoformat()
            }
            response = await client.post(url, json=payload)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(publish_test_event())
