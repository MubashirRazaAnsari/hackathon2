from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from config.database import engine
from models.task import Task, TaskCreate, TaskRead, TaskUpdate
from models.user import User
from core.auth import get_current_user

# Better Auth compliant task management router
router = APIRouter()

import httpx
import os

DAPR_PORT = os.getenv("DAPR_HTTP_PORT", 3500)
PUBSUB_NAME = "pubsub"
TOPIC_NAME = "task.completed"

async def publish_task_completed(task_id: str, user_id: str, title: str, is_recurring: bool, pattern: str):
    """Notify other services that a mission objective was completed."""
    try:
        async with httpx.AsyncClient() as client:
            url = f"http://localhost:{DAPR_PORT}/v1.0/publish/{PUBSUB_NAME}/{TOPIC_NAME}"
            payload = {
                "id": task_id,
                "user_id": user_id,
                "title": title,
                "is_recurring": is_recurring,
                "recurrence_pattern": pattern,
                "completed_at": datetime.utcnow().isoformat()
            }
            await client.post(url, json=payload)
    except Exception as e:
        print(f"Dapr Signal Error: {e}")

@router.get("/", response_model=List[TaskRead])
def read_tasks(
    status: Optional[str] = "all",
    sort: Optional[str] = "created_at",
    current_user: User = Depends(get_current_user)
):
    """
    Enhanced task retrieval with filtering and sorting for Phase 5.
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == current_user.id)
        
        if status and status != "all":
            statement = statement.where(Task.status == status)
            
        if sort == "priority":
            # high -> 0, medium -> 1, low -> 2 for ascending sort
            from sqlalchemy import case
            statement = statement.order_by(case(
                (Task.priority == "high", 0),
                (Task.priority == "medium", 1),
                (Task.priority == "low", 2)
            ))
        elif sort == "due_date":
            statement = statement.order_by(Task.due_date.asc())
        else: # default created_at
            statement = statement.order_by(Task.created_at.desc())
            
        tasks = session.exec(statement).all()
        return tasks

@router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: str, current_user: User = Depends(get_current_user)):
    """
    Better Auth compliant endpoint to read a specific user's task
    Ensures user can only access their own task
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        return task

@router.post("/", response_model=TaskRead)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user)):
    """
    Enhanced task creation for Phase 5 supporting priorities, tags, and recurrence.
    """
    with Session(engine) as session:
        db_task = Task(
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            tags=task.tags,
            due_date=task.due_date,
            is_recurring=task.is_recurring,
            recurrence_pattern=task.recurrence_pattern,
            user_id=current_user.id
        )

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task

@router.put("/{task_id}", response_model=TaskRead)
def update_task(task_id: str, task_update: TaskUpdate, current_user: User = Depends(get_current_user)):
    """
    Better Auth compliant endpoint to update a user's task
    Ensures user can only update their own task
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        db_task = session.exec(statement).first()

        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Update task with provided values
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task

@router.delete("/{task_id}")
def delete_task(task_id: str, current_user: User = Depends(get_current_user)):
    """
    Better Auth compliant endpoint to delete a user's task
    Ensures user can only delete their own task
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        db_task = session.exec(statement).first()

        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        session.delete(db_task)
        session.commit()

        return {"message": "Task deleted successfully"}

@router.patch("/{task_id}/complete")
async def complete_task(task_id: str, current_user: User = Depends(get_current_user)):
    """
    Better Auth compliant endpoint to mark a user's task as complete
    Ensures user can only complete their own task
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        db_task = session.exec(statement).first()

        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")

        db_task.status = "completed"
        db_task.completed_at = datetime.utcnow()

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        # Trigger EDA event
        await publish_task_completed(
            task_id=db_task.id,
            user_id=db_task.user_id,
            title=db_task.title,
            is_recurring=db_task.is_recurring,
            pattern=db_task.recurrence_pattern
        )

        return {"message": "Task marked as completed", "task": db_task}