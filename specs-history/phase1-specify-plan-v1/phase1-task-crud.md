# Phase I Specification: In-Memory Python CLI Todo Application

## Overview
Phase I implements a single-user, in-memory Python CLI Todo application with CRUD operations for tasks. The application will run entirely in memory with no persistence, external services, or multi-user support.

## User Stories

### US-001: Add a Task
As a user, I want to add a new task to my todo list so that I can keep track of things I need to do.

### US-002: List All Tasks
As a user, I want to view all tasks in my todo list so that I can see what needs to be done.

### US-003: Mark Task as Complete
As a user, I want to mark a task as complete so that I can track my progress.

### US-004: Delete a Task
As a user, I want to delete a task from my todo list so that I can remove obsolete items.

### US-005: View Task Details
As a user, I want to view detailed information about a specific task so that I can understand its context.

## Domain Model: Task

### Attributes
- **id** (integer, required): Unique identifier for the task, auto-generated as sequential integer starting from 1
- **title** (string, required): Title of the task, maximum 200 characters
- **description** (string, optional): Detailed description of the task, maximum 1000 characters
- **status** (string, required): Current status of the task, one of: "pending", "completed"
- **created_at** (datetime, required): Timestamp when the task was created, in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.ssssss)
- **completed_at** (datetime, optional): Timestamp when the task was marked as completed, in ISO 8601 format

### Constraints
- Task title must not be empty or contain only whitespace
- Task status must be one of the allowed values: "pending", "completed"
- Task ID must be unique within the application session
- Completed tasks cannot be marked as pending again without deleting and recreating

## CLI Command Behaviors

### Command: `add`
**Syntax**: `todo add "task title" ["optional description"]`

**Behavior**:
- Creates a new task with the provided title and optional description
- Sets status to "pending"
- Sets created_at to current timestamp
- Sets completed_at to null
- Assigns the next available sequential ID
- Outputs: "Task #ID added: 'title'"

**Example**:
```
$ todo add "Buy groceries" "Milk, bread, eggs"
Task #1 added: 'Buy groceries'
```

### Command: `list`
**Syntax**: `todo list`

**Behavior**:
- Displays all tasks in the system
- Shows ID, title, status, and creation date
- Format: `ID [status] title (created: date)`
- For completed tasks, also shows completion date: `ID [status] title (created: date, completed: date)`
- If no tasks exist, outputs: "No tasks found."

**Example**:
```
$ todo list
1 [pending] Buy groceries (created: 2026-01-05T17:30:00.123456)
2 [completed] Finish report (created: 2026-01-05T16:45:00.789012, completed: 2026-01-05T17:00:00.345678)
```

### Command: `complete`
**Syntax**: `todo complete ID`

**Behavior**:
- Marks the task with the specified ID as "completed"
- Sets completed_at to current timestamp
- If task is already completed, outputs: "Task #ID is already completed"
- If task ID doesn't exist, outputs: "Task #ID not found"
- On success, outputs: "Task #ID marked as completed"

**Example**:
```
$ todo complete 1
Task #1 marked as completed
```

### Command: `delete`
**Syntax**: `todo delete ID`

**Behavior**:
- Removes the task with the specified ID from the system
- If task ID doesn't exist, outputs: "Task #ID not found"
- On success, outputs: "Task #ID deleted"
- After deletion, the ID is not reused during the session

**Example**:
```
$ todo delete 1
Task #1 deleted
```

### Command: `view`
**Syntax**: `todo view ID`

**Behavior**:
- Displays detailed information about the specified task
- Shows all attributes: ID, title, description (if exists), status, created_at, completed_at (if completed)
- Format:
```
ID: #
Title: title
Description: description (or "N/A" if not provided)
Status: status
Created: date
Completed: date (or "N/A" if not completed)
```
- If task ID doesn't exist, outputs: "Task #ID not found"

**Example**:
```
$ todo view 1
ID: 1
Title: Buy groceries
Description: Milk, bread, eggs
Status: completed
Created: 2026-01-05T17:30:00.123456
Completed: 2026-01-05T18:00:00.456789
```

### Command: `help`
**Syntax**: `todo help` or `todo --help` or `todo -h`

**Behavior**:
- Displays available commands and their syntax
- Shows brief description of each command
- Outputs the help text to stdout

## Acceptance Criteria

### AC-001: Add Task Feature
- Given an empty task list, when adding a task with title "Test", then the task should be created with ID 1 and status "pending"
- Given a task list with existing tasks, when adding a new task, then it should receive the next sequential ID
- When adding a task with special characters in title, then the task should be stored with the exact title
- When adding a task with a description, then the description should be stored alongside the title

### AC-002: List Tasks Feature
- Given a task list with multiple tasks, when listing tasks, then all tasks should be displayed with correct status indicators
- Given an empty task list, when listing tasks, then "No tasks found." should be displayed
- When listing tasks, then completed tasks should show both creation and completion timestamps

### AC-003: Complete Task Feature
- Given a pending task, when marking it as complete, then its status should change to "completed" and completed_at timestamp should be set
- Given a completed task, when attempting to mark it as complete again, then an appropriate error message should be shown
- Given a non-existent task ID, when attempting to complete it, then an error message should be shown

### AC-004: Delete Task Feature
- Given an existing task, when deleting it, then it should be removed from the list
- Given a non-existent task ID, when attempting to delete it, then an error message should be shown
- After deleting a task, when listing tasks, then the deleted task should not appear

### AC-005: View Task Feature
- Given an existing task, when viewing it, then all its details should be displayed correctly
- Given a non-existent task ID, when attempting to view it, then an error message should be shown
- When viewing a completed task, then the completion timestamp should be displayed

### AC-006: CLI Interface
- When running the application with no arguments, then help text should be displayed
- When running an invalid command, then an error message should be displayed
- When running with insufficient arguments for a command, then an appropriate error should be displayed

## Explicit Non-Goals (What Phase I Must NOT Include)

### Persistence
- No file-based storage
- No database integration
- No saving to any external storage
- All data is lost when the application exits

### Multi-User Support
- No user authentication
- No user accounts
- No sharing between users
- Single-user only

### External Services
- No network connectivity
- No API calls to external services
- No integration with external systems
- No cloud services

### Advanced Features
- No task prioritization
- No due dates or scheduling
- No categories or tags
- No search functionality
- No filtering options
- No bulk operations
- No import/export capabilities

### Security Features
- No encryption
- No access controls beyond single-user
- No audit logging
- No data protection mechanisms

### Performance Optimizations
- No caching mechanisms
- No performance tuning
- No optimization for large datasets (assumes < 1000 tasks)

### UI Enhancements
- No interactive mode
- No GUI interface
- No color formatting
- No advanced terminal features