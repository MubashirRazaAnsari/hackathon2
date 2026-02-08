from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Session(SQLModel, table=True):
    """
    Better Auth Session table supporting both camelCase and snake_case
    """
    id: str = Field(primary_key=True)
    expires_at: Optional[datetime] = None
    expiresAt: Optional[datetime] = None
    token: str = Field(unique=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    createdAt: Optional[datetime] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None
    ip_address: Optional[str] = None
    ipAddress: Optional[str] = None
    user_agent: Optional[str] = None
    userAgent: Optional[str] = None
    user_id: str = Field(foreign_key="user.id")
    userId: Optional[str] = None

class Account(SQLModel, table=True):
    """
    Better Auth Account table supporting both camelCase and snake_case
    """
    id: str = Field(primary_key=True)
    account_id: Optional[str] = None
    accountId: Optional[str] = None
    provider_id: Optional[str] = None
    providerId: Optional[str] = None
    user_id: str = Field(foreign_key="user.id")
    userId: Optional[str] = None
    access_token: Optional[str] = None
    accessToken: Optional[str] = None
    refresh_token: Optional[str] = None
    refresh_token_expires_at: Optional[datetime] = None
    scope: Optional[str] = None
    password: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    createdAt: Optional[datetime] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None

class Verification(SQLModel, table=True):
    """
    Better Auth Verification table supporting both camelCase and snake_case
    """
    id: str = Field(primary_key=True)
    identifier: str
    value: str
    expires_at: Optional[datetime] = None
    expiresAt: Optional[datetime] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    createdAt: Optional[datetime] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = None
