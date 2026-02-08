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
    User model compliant with Better Auth standards (User table)
    """
    id: str = Field(primary_key=True)
    name: str = Field(max_length=255)
    email: str = Field(unique=True, nullable=False, max_length=255)
    email_verified: bool = Field(default=False)
    image: Optional[str] = Field(default=None, max_length=1000)
    password_hash: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to Tasks
    # Using string reference to avoid circular imports if Task is in another file
    tasks: List["Task"] = Relationship(back_populates="user")
    
    # Relationship to Conversations
    conversations: List["Conversation"] = Relationship(back_populates="user")

class UserRead(UserBase):
    id: str
    name: str
    image: Optional[str] = None

class UserUpdate(SQLModel):
    name: Optional[str] = None
    image: Optional[str] = None