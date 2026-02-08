from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid

class MessageBase(SQLModel):
    """
    Base message model for chat interactions
    """
    role: str = Field(regex="^(user|assistant|system)$")
    content: str
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

class Message(MessageBase, table=True):
    """
    Message model storing individual chat turns
    """
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id")

    # Relationship
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")

class MessageRead(MessageBase):
    """
    Message read model
    """
    id: str
    conversation_id: str

class MessageCreate(MessageBase):
    """
    Message creation model
    """
    conversation_id: str
