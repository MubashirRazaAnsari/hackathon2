from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlmodel import Session, select
from config.database import engine
from models.user import User, UserRead
from core.auth import get_current_user



# Better Auth compliant authentication router
router = APIRouter()

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Returns current authenticated user's profile information.
    The session is validated via the Better Auth session table in get_current_user.
    """
    return current_user