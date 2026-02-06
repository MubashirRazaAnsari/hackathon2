# Phase I Implementation Plan: In-Memory Python CLI Todo Application

## Overview
This plan defines the implementation approach for Phase I of the Hackathon II project based on the specification in `specs/features/phase1-task-crud.md`. The implementation will be a single-user, in-memory Python CLI Todo application with CRUD operations using only Python standard library.

## High-Level Architecture

### Modules Structure
The application will be organized into the following modules:

#### `todo_app.py` (Main Application Module)
- **Responsibility**: Contains the main application class that orchestrates all functionality
- **Functions**:
  - Initialize the in-memory state
  - Handle command parsing and routing
  - Coordinate between data model and CLI interface
  - Execute application main loop

#### `models.py` (Data Model Module)
- **Responsibility**: Defines the Task data model and in-memory storage
- **Functions**:
  - Define Task class with all required attributes
  - Implement in-memory storage using Python data structures
  - Provide CRUD operations for tasks
  - Handle ID generation and uniqueness constraints

#### `cli.py` (Command-Line Interface Module)
- **Responsibility**: Handle command-line argument parsing and user interaction
- **Functions**:
  - Parse command-line arguments
  - Display formatted output to user
  - Handle user input validation
  - Format and display error messages

#### `main.py` (Entry Point Module)
- **Responsibility**: Application entry point that initializes and runs the application
- **Functions**:
  - Parse command-line arguments
  - Initialize the TodoApp instance
  - Execute requested command

## Data Flow for Each CLI Command

### Add Command Data Flow
1. `main.py` receives command-line arguments
2. Parse command as `add "title" ["description"]`
3. Validate title is not empty/whitespace only
4. Create new Task instance with:
   - Auto-generated sequential ID
   - Provided title and description
   - Status set to "pending"
   - created_at set to current timestamp
   - completed_at set to None
5. Store task in in-memory storage
6. Output success message: "Task #ID added: 'title'"

### List Command Data Flow
1. `main.py` receives command-line arguments
2. Parse command as `list`
3. Retrieve all tasks from in-memory storage
4. Format each task according to specification:
   - For pending tasks: `ID [status] title (created: date)`
   - For completed tasks: `ID [status] title (created: date, completed: date)`
5. Output formatted list or "No tasks found." if empty

### Complete Command Data Flow
1. `main.py` receives command-line arguments
2. Parse command as `complete ID`
3. Validate ID is a valid integer
4. Look up task by ID in storage
5. If task not found, output: "Task #ID not found"
6. If task already completed, output: "Task #ID is already completed"
7. If task found and pending:
   - Update status to "completed"
   - Set completed_at to current timestamp
   - Output: "Task #ID marked as completed"

### Delete Command Data Flow
1. `main.py` receives command-line arguments
2. Parse command as `delete ID`
3. Validate ID is a valid integer
4. Look up task by ID in storage
5. If task not found, output: "Task #ID not found"
6. If task found:
   - Remove task from storage
   - Output: "Task #ID deleted"

### View Command Data Flow
1. `main.py` receives command-line arguments
2. Parse command as `view ID`
3. Validate ID is a valid integer
4. Look up task by ID in storage
5. If task not found, output: "Task #ID not found"
6. If task found:
   - Format task details according to specification:
     ```
     ID: #
     Title: title
     Description: description (or "N/A" if not provided)
     Status: status
     Created: date
     Completed: date (or "N/A" if not completed)
     ```
   - Output formatted details

### Help Command Data Flow
1. `main.py` receives command-line arguments
2. Parse command as `help`, `--help`, or `-h`
3. Display help text with all available commands and their syntax
4. Output help text to stdout

## In-Memory State Management Strategy

### Storage Implementation
- Use a Python dictionary as the primary storage mechanism: `tasks = {}`
- Key: Task ID (integer)
- Value: Task object instance
- Use a separate counter variable to track the next available ID: `next_id = 1`

### State Lifecycle
- Initialize empty dictionary and next_id counter when application starts
- Add new tasks to dictionary with auto-incremented IDs
- Update tasks in-place within the dictionary
- Remove tasks from dictionary on deletion
- State exists only for the duration of the application session

### ID Management
- Maintain a `next_id` counter starting at 1
- When adding a new task, assign the current `next_id` value
- Increment `next_id` after successful task creation
- IDs are never reused during the same session (even after deletion)

## Error Handling Strategy

### Input Validation
- Validate command arguments match expected format
- Validate that task IDs are valid integers
- Validate that task titles are not empty or whitespace-only
- Validate that task status values are only "pending" or "completed"

### Error Response Types
- **Invalid Command**: Output error message and show help text
- **Invalid Arguments**: Output specific error message about argument format
- **Task Not Found**: Output "Task #ID not found" message
- **Invalid State Operation**: Output appropriate error (e.g., "Task already completed")

### Exception Handling
- Catch and handle ValueError for invalid integer conversions
- Catch and handle any other exceptions that might occur during normal operation
- Provide user-friendly error messages for all error conditions
- Never crash the application; always return to a stable state

## CLI Interaction Flow

### Command Processing Flow
1. Application starts in `main.py`
2. Parse sys.argv for command and arguments
3. Validate command format and arguments
4. Route to appropriate handler function
5. Execute operation in models layer
6. Format and return response to user
7. Exit application gracefully

### Argument Parsing
- Use Python's `sys.argv` for basic argument parsing
- Identify command from first argument after script name
- Parse remaining arguments based on command type
- Handle quoted strings properly for title and description

### Output Formatting
- Use consistent formatting as specified in the feature specification
- Use print() for all output to stdout
- Use appropriate error messages for different error conditions
- Maintain clean, readable output format

## Dependencies and Constraints

### Standard Library Only
- Use only Python standard library modules
- No external dependencies allowed
- Compatible with Python 3.6+
- No third-party packages

### Non-Functional Requirements
- Application must start quickly (in-memory only)
- Operations must be responsive for < 1000 tasks
- Memory usage should be efficient
- No persistent state between sessions