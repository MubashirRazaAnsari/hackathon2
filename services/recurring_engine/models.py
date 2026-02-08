from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: str = Field(default="pending", regex="^(pending|completed)$")
    priority: str = Field(default="medium", regex="^(low|medium|high)$")
    tags: Optional[str] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    is_recurring: bool = Field(default=False)
    recurrence_pattern: Optional[str] = Field(default=None)
    
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

class Task(TaskBase, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field() # No foreign key check needed in this microservice
