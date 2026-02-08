from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Task(SQLModel, table=True):
    """
    Simplified Task model for notification service.
    Matches the backend Task model structure.
    """
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: str
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"
    tags: Optional[str] = None
    due_date: Optional[datetime] = None
    is_recurring: bool = False
    recurrence_pattern: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
