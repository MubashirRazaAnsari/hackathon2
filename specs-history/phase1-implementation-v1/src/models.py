# Task ID: T-002
# Domain model for Task entity as specified in Phase I requirements
# Task ID: T-003
# In-memory storage mechanism and ID management
# Task ID: T-004
# Core task operation logic (CRUD operations)

from datetime import datetime
from typing import Optional, Dict


# ========== T-002: Task Domain Model ==========
class Task:
    """
    Task domain model representing a todo item.

    Attributes:
        id: Unique identifier for the task
        title: Title of the task (required)
        description: Optional description of the task
        status: Status of the task ('pending' or 'completed')
        created_at: Timestamp when the task was created
        completed_at: Timestamp when the task was completed (None if pending)
    """

    def __init__(self, id: int, title: str, description: str = "", status: str = "pending",
                 created_at: Optional[datetime] = None, completed_at: Optional[datetime] = None):
        """
        Initialize a Task instance.

        Args:
            id: Unique identifier for the task
            title: Title of the task (required)
            description: Optional description of the task
            status: Status of the task ('pending' or 'completed'), defaults to 'pending'
            created_at: Timestamp when the task was created, defaults to now
            completed_at: Timestamp when the task was completed, defaults to None
        """
        self.id = id
        self.title = title
        self.description = description
        self.status = status
        self.created_at = created_at or datetime.now()
        self.completed_at = completed_at

    def __repr__(self):
        """String representation of the Task instance."""
        return f"Task(id={self.id}, title='{self.title}', status='{self.status}')"

    def __str__(self):
        """Human-readable string representation of the Task instance."""
        return f"Task {self.id}: {self.title} [{self.status}]"


# ========== T-003: Storage Container + ID Generation ==========
# ========== T-004: Core CRUD Logic ==========
class InMemoryTaskStorage:
    """
    In-memory storage mechanism for Task objects with auto-increment ID management.

    Attributes:
        tasks: Dictionary to store Task objects with their ID as key
        next_id: Counter for auto-incrementing task IDs
    """

    def __init__(self):
        """
        Initialize the in-memory storage with an empty task dictionary and ID counter starting at 1.
        """
        self.tasks: Dict[int, Task] = {}
        self.next_id: int = 1

    def get_next_id(self) -> int:
        """
        Get the next available ID and increment the counter.

        Returns:
            The next available ID for a new task
        """
        current_id = self.next_id
        self.next_id += 1
        return current_id

    def create_task(self, title: str, description: str = "") -> Task:
        """
        Create a new task with auto-generated ID.

        Args:
            title: Title of the task (required)
            description: Optional description of the task

        Returns:
            The newly created Task object
        """
        new_id = self.get_next_id()
        task = Task(
            id=new_id,
            title=title,
            description=description,
            status="pending"
        )
        self.tasks[new_id] = task
        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """
        Retrieve a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task object if found, None otherwise
        """
        return self.tasks.get(task_id)

    def get_all_tasks(self) -> Dict[int, Task]:
        """
        Retrieve all tasks.

        Returns:
            Dictionary containing all tasks with their IDs as keys
        """
        return self.tasks.copy()

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None,
                    status: Optional[str] = None) -> Optional[Task]:
        """
        Update an existing task.

        Args:
            task_id: The ID of the task to update
            title: New title (optional)
            description: New description (optional)
            status: New status (optional)

        Returns:
            The updated Task object if successful, None if task doesn't exist
        """
        if task_id not in self.tasks:
            return None

        task = self.tasks[task_id]
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if status is not None:
            task.status = status

        return task

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if the task was deleted, False if the task doesn't exist
        """
        if task_id in self.tasks:
            del self.tasks[task_id]
            return True
        return False