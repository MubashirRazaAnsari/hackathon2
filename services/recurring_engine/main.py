from fastapi import FastAPI, Body
from dapr.ext.fastapi import DaprApp
from sqlmodel import Session, select
from datetime import datetime, timedelta
import os
import sys

# Add parent dir to path to import models if needed, 
# but in Docker we will structure it correctly.
from database import engine
from models import Task

app = FastAPI(title="Recurring Task Engine")
dapr_app = DaprApp(app)

@app.get("/health")
def health():
    return {"status": "ok"}

@dapr_app.subscribe(pubsub='pubsub', topic='task.completed')
def task_completed_handler(event_data = Body(...)):
    print(f"Received completion event: {event_data}")
    
    is_recurring = event_data.get('is_recurring', False)
    if not is_recurring:
        return {"status": "ignored", "reason": "not_recurring"}
    
    user_id = event_data.get('user_id')
    title = event_data.get('title')
    pattern = event_data.get('recurrence_pattern', 'daily')
    
    # Calculate next due date
    now = datetime.utcnow()
    if pattern == 'daily':
        next_due = now + timedelta(days=1)
    elif pattern == 'weekly':
        next_due = now + timedelta(weeks=1)
    elif pattern == 'monthly':
        # Simple month approximation
        next_due = now + timedelta(days=30)
    else:
        next_due = now + timedelta(days=1)

    with Session(engine) as session:
        new_task = Task(
            title=title,
            description=f"Auto-generated mission objective based on {pattern} pattern.",
            status="pending",
            priority="medium", # Default for new recurring task
            is_recurring=True,
            recurrence_pattern=pattern,
            user_id=user_id,
            due_date=next_due
        )
        session.add(new_task)
        session.commit()
        print(f"Created next instance for recurring task: {title}")

    return {"status": "success", "next_due": next_due.isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
