from sqlmodel import Session, select
from typing import Optional, List, Dict, Any
from datetime import datetime
from config.database import engine
from models.task import Task
from models.user import User

def add_task(
    user_id: str, 
    title: str, 
    description: Optional[str] = None,
    priority: Optional[str] = "medium",
    tags: Optional[str] = None,
    due_date: Optional[str] = None,
    is_recurring: bool = False,
    recurrence_pattern: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a new task with Phase 5 fields.
    """
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            return {"error": "User not found"}

        # Convert string due_date to datetime if provided
        dt_due = None
        if due_date:
            try:
                dt_due = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            except:
                pass

        task = Task(
            title=title,
            description=description,
            priority=priority,
            tags=tags,
            due_date=dt_due,
            is_recurring=is_recurring,
            recurrence_pattern=recurrence_pattern,
            user_id=user_id,
            status="pending"
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        
        return {
            "task_id": task.id,
            "status": "created",
            "title": task.title,
            "priority": task.priority
        }

def list_tasks(
    user_id: str, 
    status: Optional[str] = "all",
    sort: Optional[str] = "created_at"
) -> List[Dict[str, Any]]:
    """
    List tasks with status filtering and sorting.
    """
    with Session(engine) as session:
        query = select(Task).where(Task.user_id == user_id)
        
        if status and status != "all":
            query = query.where(Task.status == status)
            
        if sort == "priority":
            from sqlalchemy import case
            query = query.order_by(case(
                (Task.priority == "high", 0),
                (Task.priority == "medium", 1),
                (Task.priority == "low", 2)
            ))
        elif sort == "due_date":
            query = query.order_by(Task.due_date.asc())
        else:
            query = query.order_by(Task.created_at.desc())
            
        tasks = session.exec(query).all()
        
        return [
            {
                "id": t.id,
                "title": t.title,
                "completed": t.status == "completed",
                "status": t.status,
                "priority": t.priority,
                "due_date": t.due_date.isoformat() if t.due_date else None,
                "tags": t.tags
            }
            for t in tasks
        ]

def update_task(
    user_id: str, 
    task_id: str, 
    title: Optional[str] = None, 
    description: Optional[str] = None,
    priority: Optional[str] = None,
    tags: Optional[str] = None,
    due_date: Optional[str] = None,
    status: Optional[str] = None
) -> Dict[str, Any]:
    """
    Update any task field including Phase 5 properties.
    """
    with Session(engine) as session:
        query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(query).first()
        
        if not task:
            return {"error": "Task not found"}
            
        if title: task.title = title
        if description: task.description = description
        if priority: task.priority = priority
        if tags: task.tags = tags
        if status: task.status = status
        
        if due_date:
            try:
                task.due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            except:
                pass
            
        session.add(task)
        session.commit()
        session.refresh(task)
        
        return {
            "task_id": task.id,
            "status": "updated",
            "title": task.title
        }

def delete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Delete a task.
    """
    with Session(engine) as session:
        query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(query).first()
        
        if not task:
            return {"error": "Task not found"}
            
        title = task.title
        session.delete(task)
        session.commit()
        
        return {
            "task_id": task_id,
            "status": "deleted",
            "title": title
        }

def complete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Mark a task as complete.
    """
    with Session(engine) as session:
        query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(query).first()
        
        if not task:
            return {"error": "Task not found"}
            
        task.status = "completed"
        task.completed_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)
        
        return {
            "task_id": task.id,
            "status": "completed",
            "title": task.title
        }
