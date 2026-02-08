from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid

class ConversationBase(SQLModel):
    """
    Base conversation model following Better Auth principles
    """
    title: Optional[str] = Field(default="New Conversation", max_length=200)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

class Conversation(ConversationBase, table=True):
    """
    Conversation model for storing chat sessions
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")

    # Relationships
    user: Optional["User"] = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(back_populates="conversation")

class ConversationRead(ConversationBase):
    """
    Conversation read model
    """
    id: str
    user_id: str

class ConversationCreate(ConversationBase):
    """
    Conversation creation model
    """
    pass
