from fastapi import FastAPI, Body
from dapr.ext.fastapi import DaprApp
from sqlmodel import Session, select
from datetime import datetime, timedelta
from database import engine
from models import Task
import httpx
import os
import json

app = FastAPI(title="Notification Service", version="1.0.0")
dapr_app = DaprApp(app)

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", "3500")
DAPR_BASE_URL = f"http://localhost:{DAPR_HTTP_PORT}"

print("🔔 Notification Service Starting...")
print(f"📡 Dapr HTTP Port: {DAPR_HTTP_PORT}")

# ============ DAPR STATE HELPERS ============

async def save_notification_state(task_id: str, user_id: str, notification_type: str):
    """Save notification state to prevent duplicates"""
    try:
        async with httpx.AsyncClient() as client:
            key = f"notification:{user_id}:{task_id}:{datetime.utcnow().date()}"
            value = {
                "task_id": task_id,
                "user_id": user_id,
                "sent_at": datetime.utcnow().isoformat(),
                "notification_type": notification_type
            }
            url = f"{DAPR_BASE_URL}/v1.0/state/statestore"
            payload = [{"key": key, "value": value}]
            await client.post(url, json=payload)
            print(f"💾 Saved notification state: {key}")
    except Exception as e:
        print(f"❌ State save error: {e}")

async def check_notification_sent(task_id: str, user_id: str) -> bool:
    """Check if notification was already sent today"""
    try:
        async with httpx.AsyncClient() as client:
            key = f"notification:{user_id}:{task_id}:{datetime.utcnow().date()}"
            url = f"{DAPR_BASE_URL}/v1.0/state/statestore/{key}"
            response = await client.get(url)
            if response.status_code == 200 and response.text:
                print(f"✅ Notification already sent: {key}")
                return True
            return False
    except Exception as e:
        print(f"❌ State check error: {e}")
        return False

# ============ EVENT HANDLERS ============

@dapr_app.subscribe(pubsub='pubsub', topic='task.completed')
async def task_completed_handler(event_data = Body(...)):
    """
    Handle task completion events from Kafka via Dapr Pub/Sub.
    Logs the event and sends notification for recurring tasks.
    """
    print(f"\n📨 Received task.completed event:")
    print(f"   Task ID: {event_data.get('id')}")
    print(f"   Title: {event_data.get('title')}")
    print(f"   User: {event_data.get('user_id')}")
    print(f"   Recurring: {event_data.get('is_recurring')}")
    
    # If recurring task, notify user about next instance
    if event_data.get('is_recurring'):
        message = f"🔄 Recurring task '{event_data.get('title')}' completed. Next instance created."
        print(f"   📢 Notification: {message}")
        
        # Save notification state
        await save_notification_state(
            task_id=event_data.get('id'),
            user_id=event_data.get('user_id'),
            notification_type="recurring_completion"
        )
    
    return {"status": "processed"}

# ============ CRON BINDING HANDLER ============

@app.post("/api/notifications/reminder-check")
async def reminder_check_handler(event_data = Body(...)):
    """
    Triggered by Dapr cron binding every hour.
    Checks for tasks due in the next 24 hours and sends reminders.
    """
    print(f"\n⏰ Cron trigger received at {datetime.utcnow()}")
    print(f"   Checking for tasks due in next 24 hours...")
    
    notifications_sent = []
    now = datetime.utcnow()
    tomorrow = now + timedelta(hours=24)
    
    try:
        with Session(engine) as session:
            # Query tasks due in next 24 hours that are not completed
            statement = select(Task).where(
                Task.due_date != None,
                Task.due_date > now,
                Task.due_date <= tomorrow,
                Task.status == "pending"
            )
            tasks = session.exec(statement).all()
            
            print(f"   Found {len(tasks)} tasks due soon")
            
            for task in tasks:
                # Check if we already sent a reminder today
                already_sent = await check_notification_sent(task.id, task.user_id)
                if already_sent:
                    continue
                
                # Calculate time until due
                time_until_due = task.due_date - now
                hours_until = int(time_until_due.total_seconds() / 3600)
                
                # Format notification message
                message = f"⏰ Reminder: '{task.title}' is due in {hours_until} hours"
                if task.priority == "high":
                    message = f"🔴 URGENT: {message}"
                
                print(f"\n   📢 Sending reminder:")
                print(f"      Task: {task.title}")
                print(f"      User: {task.user_id}")
                print(f"      Due: {task.due_date}")
                print(f"      Message: {message}")
                
                # Save notification state to prevent duplicates
                await save_notification_state(
                    task_id=task.id,
                    user_id=task.user_id,
                    notification_type="due_date_reminder"
                )
                
                notifications_sent.append({
                    "task_id": task.id,
                    "title": task.title,
                    "user_id": task.user_id,
                    "message": message
                })
    
    except Exception as e:
        print(f"   ❌ Error checking reminders: {e}")
        return {"status": "error", "message": str(e)}
    
    print(f"\n   ✅ Reminder check complete. Sent {len(notifications_sent)} notifications")
    return {
        "status": "success",
        "notifications_sent": len(notifications_sent),
        "details": notifications_sent
    }

# ============ HEALTH CHECK ============

@app.get("/health")
def health_check():
    """Health check endpoint for Kubernetes readiness/liveness probes"""
    return {"status": "healthy", "service": "notification", "timestamp": datetime.utcnow().isoformat()}

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "service": "Notification Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "reminder_check": "/api/notifications/reminder-check",
            "subscriptions": ["task.completed"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
