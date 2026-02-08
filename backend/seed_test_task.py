from sqlmodel import Session, select
from config.database import engine
from models.user import User
from models.task import Task
from models.conversation import Conversation
from models.message import Message
import uuid

def test_flow():
    with Session(engine) as session:
        user = session.exec(select(User)).first()
        if not user:
            print("No user found")
            return
        
        # Create a recurring task
        task = Task(
            title="Automated Recurrence Test",
            description="Testing Dapr/Kafka event flow",
            status="pending",
            priority="high",
            is_recurring=True,
            recurrence_pattern="daily",
            user_id=user.id
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        print(f"Created task: {task.id}")
        return task.id

if __name__ == "__main__":
    test_flow()
