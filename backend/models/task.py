from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid

class TaskBase(SQLModel):
    """
    Base task model following Better Auth principles for task data structure
    """
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: str = Field(default="pending", regex="^(pending|completed)$")
    priority: str = Field(default="medium", regex="^(low|medium|high)$")
    tags: Optional[str] = Field(default=None) # Comma-separated tags
    due_date: Optional[datetime] = Field(default=None)
    is_recurring: bool = Field(default=False)
    recurrence_pattern: Optional[str] = Field(default=None) # daily, weekly, monthly
    
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

class Task(TaskBase, table=True):
    """
    Task model compliant with Better Auth standards for user-scoped task management
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")

    # Relationship to User (forward reference)
    user: Optional["User"] = Relationship(back_populates="tasks")

class TaskRead(TaskBase):
    """
    Task read model following Better Auth principles for task data exposure
    """
    id: str
    user_id: str

class TaskCreate(TaskBase):
    """
    Task creation model following Better Auth standards for secure task creation
    """
    pass

class TaskUpdate(SQLModel):
    """
    Task update model following Better Auth principles for task data modification
    """
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[str] = None
    due_date: Optional[datetime] = None
    is_recurring: Optional[bool] = None
    recurrence_pattern: Optional[str] = None