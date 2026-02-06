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
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

class Task(TaskBase, table=True):
    """
    Task model compliant with Better Auth standards for user-scoped task management
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: str = Field(default="pending", regex="^(pending|completed)$")
    user_id: str = Field(foreign_key="user.id")

    # Relationship to User (forward reference)
    user: Optional["User"] = Relationship(back_populates="tasks")

    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

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
    title: str
    description: Optional[str] = None

class TaskUpdate(SQLModel):
    """
    Task update model following Better Auth principles for task data modification
    """
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None