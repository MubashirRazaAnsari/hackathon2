# Task ID: T-005
# CLI command implementation for adding tasks
# Task ID: T-006
# CLI command implementation for listing tasks
# Task ID: T-007
# CLI command implementation for completing tasks
# Task ID: T-008
# CLI command implementation for deleting tasks
# Task ID: T-009
# CLI command implementation for viewing tasks
# Task ID: T-010
# CLI help command implementation
import argparse
import sys
from models import InMemoryTaskStorage
from datetime import datetime


class TodoCLI:
    """
    Command-line interface for the todo application.

    Implements the 'add' command as specified in Task T-005.
    Implements the 'list' command as specified in Task T-006.
    Implements the 'complete' command as specified in Task T-007.
    Implements the 'delete' command as specified in Task T-008.
    Implements the 'view' command as specified in Task T-009.
    Implements the 'help' command as specified in Task T-010.
    """

    def __init__(self, storage: InMemoryTaskStorage):
        """
        Initialize the CLI with a storage instance.

        Args:
            storage: An instance of InMemoryTaskStorage to manage tasks
        """
        self.storage = storage

    def add_task(self, title: str, description: str = ""):
        """
        Add a new task with the provided title and optional description.

        Args:
            title: Title of the task (required)
            description: Description of the task (optional)

        Returns:
            The newly created Task object
        """
        # Validate that title is not empty or whitespace only
        if not title.strip():
            raise ValueError("Task title cannot be empty or whitespace only")

        # Create the task using the storage's create_task method
        task = self.storage.create_task(title.strip(), description)

        # Print the user-facing output as specified
        print(f"Task #{task.id} added: '{task.title}'")

        return task

    def list_tasks(self):
        """
        List all tasks with proper formatting.
        """
        tasks = self.storage.get_all_tasks()

        if not tasks:
            print("No tasks found.")
        else:
            # Sort tasks by ID to ensure consistent ordering
            sorted_tasks = sorted(tasks.values(), key=lambda t: t.id)

            for task in sorted_tasks:
                # Format the creation date
                created_str = task.created_at.strftime('%Y-%m-%dT%H:%M:%S.%f')

                if task.status == "completed":
                    # For completed tasks, show both creation and completion dates
                    completed_str = task.completed_at.strftime('%Y-%m-%dT%H:%M:%S.%f') if task.completed_at else "N/A"
                    print(f"{task.id} [{task.status}] {task.title} (created: {created_str}, completed: {completed_str})")
                else:
                    # For pending tasks, show only creation date
                    print(f"{task.id} [{task.status}] {task.title} (created: {created_str})")

    def complete_task(self, task_id: int):
        """
        Mark a task as completed.

        Args:
            task_id: ID of the task to mark as completed
        """
        # First, get the task to check if it exists and its current status
        task = self.storage.get_task(task_id)

        if task is None:
            print(f"Task #{task_id} not found")
            return

        if task.status == "completed":
            print(f"Task #{task_id} is already completed")
            return

        # Update the task status to completed and set the completion timestamp
        task.status = "completed"
        task.completed_at = datetime.now()

        print(f"Task #{task_id} marked as completed")

    def delete_task(self, task_id: int):
        """
        Delete a task by its ID.

        Args:
            task_id: ID of the task to delete
        """
        # Attempt to delete the task
        success = self.storage.delete_task(task_id)

        if success:
            print(f"Task #{task_id} deleted")
        else:
            print(f"Task #{task_id} not found")

    def view_task(self, task_id: int):
        """
        View detailed information about a specific task.

        Args:
            task_id: ID of the task to view
        """
        task = self.storage.get_task(task_id)

        if task is None:
            print(f"Task #{task_id} not found")
            return

        # Format the dates
        created_str = task.created_at.strftime('%Y-%m-%dT%H:%M:%S.%f')
        completed_str = task.completed_at.strftime('%Y-%m-%dT%H:%M:%S.%f') if task.completed_at else "N/A"

        # Format the description
        description_str = task.description if task.description else "N/A"

        # Print the task details in the required format
        print(f"ID: {task.id}")
        print(f"Title: {task.title}")
        print(f"Description: {description_str}")
        print(f"Status: {task.status}")
        print(f"Created: {created_str}")
        print(f"Completed: {completed_str}")

    def show_help(self):
        """
        Display help text with all available commands.
        """
        help_text = """Todo CLI Application

Available commands:
  add "title" ["description"]  Add a new task
  list                        List all tasks
  complete ID                 Mark a task as completed
  delete ID                   Delete a task
  view ID                     View detailed information about a task
  help                        Show this help message

Examples:
  todo add "Buy groceries" "Milk, bread, eggs"
  todo list
  todo complete 1
  todo delete 1
  todo view 1
"""
        print(help_text)

    def parse_and_execute(self, args=None):
        """
        Parse command-line arguments and execute the appropriate command.

        Args:
            args: Command-line arguments to parse (defaults to sys.argv)
        """
        parser = argparse.ArgumentParser(description='Todo CLI Application')
        subparsers = parser.add_subparsers(dest='command', help='Available commands')

        # Add command parser
        add_parser = subparsers.add_parser('add', help='Add a new task')
        add_parser.add_argument('title', nargs='?', help='Title of the task')
        add_parser.add_argument('description', nargs='*', help='Optional description of the task')

        # List command parser
        subparsers.add_parser('list', help='List all tasks')

        # Complete command parser
        complete_parser = subparsers.add_parser('complete', help='Mark a task as completed')
        complete_parser.add_argument('id', type=int, help='ID of the task to complete')

        # Delete command parser
        delete_parser = subparsers.add_parser('delete', help='Delete a task')
        delete_parser.add_argument('id', type=int, help='ID of the task to delete')

        # View command parser
        view_parser = subparsers.add_parser('view', help='View detailed information about a task')
        view_parser.add_argument('id', type=int, help='ID of the task to view')

        # Help command parser
        subparsers.add_parser('help', help='Show help message')

        parsed_args = parser.parse_args(args)

        if parsed_args.command == 'add':
            # Combine description parts into a single string
            description = ' '.join(parsed_args.description) if parsed_args.description else ""

            # Validate that title is provided
            if not parsed_args.title:
                print("Error: Title is required for the add command", file=sys.stderr)
                parser.print_help()
                return

            try:
                self.add_task(parsed_args.title, description)
            except ValueError as e:
                print(f"Error: {e}", file=sys.stderr)
        elif parsed_args.command == 'list':
            self.list_tasks()
        elif parsed_args.command == 'complete':
            self.complete_task(parsed_args.id)
        elif parsed_args.command == 'delete':
            self.delete_task(parsed_args.id)
        elif parsed_args.command == 'view':
            self.view_task(parsed_args.id)
        elif parsed_args.command == 'help':
            self.show_help()
        else:
            # If no command is provided, show help
            parser.print_help()