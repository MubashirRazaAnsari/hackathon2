# Task ID: T-001
# Entry point for Phase I implementation
# Task ID: T-005
# Integration of CLI command for adding tasks with core logic
# Task ID: T-011
# Final wiring and command dispatch in main.py

import sys
from models import InMemoryTaskStorage
from cli import TodoCLI


def main():
    """
    Entry point for the application.
    Task T-001: Create minimal entry point file under Phase 1/src/
    Task T-005: Integrate CLI with core logic for add command
    Task T-011: Final wiring and command dispatch
    """
    # Initialize the in-memory storage
    storage = InMemoryTaskStorage()

    # Initialize the CLI with the storage
    cli = TodoCLI(storage)

    # Parse and execute the command
    cli.parse_and_execute(sys.argv[1:] if len(sys.argv) > 1 else None)


if __name__ == "__main__":
    main()