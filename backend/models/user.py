from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid

class UserBase(SQLModel):
    """
    Base user model following Better Auth principles for user data structure
    """
    email: str = Field(unique=True, nullable=False, max_length=255)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

class User(UserBase, table=True):
    """
    User model compliant with Better Auth standards for user management
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255)
    password_hash: str = Field(nullable=False, max_length=255)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to Tasks
    tasks: List["Task"] = Relationship(back_populates="user")

class UserRead(UserBase):
    """
    User read model following Better Auth principles for user data exposure
    """
    id: str

class UserCreate(UserBase):
    """
    User creation model following Better Auth standards for secure user registration
    """
    email: str
    password: str

class UserUpdate(SQLModel):
    """
    User update model following Better Auth principles for user data modification
    """
    email: Optional[str] = None
    password: Optional[str] = None