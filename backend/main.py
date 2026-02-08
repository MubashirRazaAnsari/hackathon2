from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine
from models.user import User  # noqa: F401
from models.task import Task  # noqa: F401
from models.conversation import Conversation  # noqa: F401
from models.message import Message  # noqa: F401
from models.auth import Session as AuthSession, Account, Verification  # noqa: F401
from api.auth import router as auth_router
from api.tasks import router as tasks_router
from api.chat import router as chat_router

# Create tables in database
from sqlmodel import SQLModel
SQLModel.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}