from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from config.database import engine
from models.user import User
from models.auth import Session as AuthSession
import os
from dotenv import load_dotenv

load_dotenv()

# Better Auth configuration
BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")

if not BETTER_AUTH_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable must be set")

security = HTTPBearer()

# Removed legacy authenticate_user, verify_password, etc.
# Better Auth handles password hashing and authentication on the frontend.

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Better Auth session validator.
    Checks the token against the Session table.
    """
    token = credentials.credentials

    with Session(engine) as session:
        # 1. Try to find Better Auth session by token
        # Better Auth stores the session token in the 'token' field
        stmt = select(AuthSession).where(AuthSession.token == token)
        db_session = session.exec(stmt).first()

        if db_session:
            # Check expiration (Better Auth might use 'expiresAt' or 'expires_at')
            expires_at = db_session.expires_at or db_session.expiresAt
            
            if expires_at and expires_at < datetime.utcnow():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            # Get user (Better Auth might use 'userId' or 'user_id')
            uid = db_session.user_id or db_session.userId
            if uid:
                user_stmt = select(User).where(User.id == uid)
                user = session.exec(user_stmt).first()
                if user:
                    return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate Better Auth session",
        headers={"WWW-Authenticate": "Bearer"},
    )