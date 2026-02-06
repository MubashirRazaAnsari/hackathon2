from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlmodel import Session, select
from config.database import engine
from models.user import User, UserCreate, UserRead
from core.auth import authenticate_user, create_access_token, get_password_hash, get_current_user
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Better Auth compliant authentication router
router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user_data: UserCreate):
    """
    Better Auth compliant user registration endpoint
    Creates a new user account with secure password hashing
    """
    with Session(engine) as session:
        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Hash the password following Better Auth principles
        hashed_password = get_password_hash(user_data.password)

        # Create new user
        db_user = User(
            email=user_data.email,
            password_hash=hashed_password
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        return db_user

@router.post("/login")
def login(credentials: HTTPBasicCredentials = Depends(HTTPBasic())):
    """
    Better Auth compliant user login endpoint
    Authenticates user and generates secure JWT token
    """
    user = authenticate_user(credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )

    access_token_expires = timedelta(minutes=float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")))
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Better Auth compliant user profile endpoint
    Returns current authenticated user's profile information
    """
    return current_user