from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
from config.database import engine
from models.task import Task, TaskCreate, TaskRead, TaskUpdate
from models.user import User
from core.auth import get_current_user

# Better Auth compliant task management router
router = APIRouter()

@router.get("/", response_model=List[TaskRead])
def read_tasks(current_user: User = Depends(get_current_user)):
    """
    Better Auth compliant endpoint to read user's tasks
    Ensures user can only access their own tasks
    """
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == current_user.id)
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
    Better Auth compliant endpoint to create a new task for the authenticated user
    Ensures task is associated with the correct user
    """
    with Session(engine) as session:
        db_task = Task(
            title=task.title,
            description=task.description,
            status=task.status,
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
def complete_task(task_id: str, current_user: User = Depends(get_current_user)):
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

        return {"message": "Task marked as completed", "task": db_task}