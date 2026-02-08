# Agent & MCP Tools Specification

## Overview

This document defines the Model Context Protocol (MCP) tools available to the AI agent in the Todo Application.

## Agent Persona

- **Name**: Todo Assistant
- **Role**: Intelligent Task Manager
- **Capabilities**: Managing tasks, understanding natural language, filtering, sorting, and scheduling.

## MCP Tools

### 1. `add_task`

**Description**: Creates a new task with advanced attributes.

- **Parameters**:
  - `title` (string, required): Task description.
  - `priority` (string, optional): "low", "medium", "high".
  - `due_date` (string, optional): ISO format or natural language (e.g., "tomorrow").
  - `tags` (string, optional): Comma-separated tags (e.g., "work,urgent").
  - `is_recurring` (boolean, optional): True if task repeats.
  - `recurrence_pattern` (string, optional): "daily", "weekly", "monthly".

### 2. `list_tasks`

**Description**: Retrieves tasks with filtering and sorting.

- **Parameters**:
  - `status` (string, optional): "pending", "completed", "all".
  - `priority` (string, optional): Filter by priority.
  - `search` (string, optional): Fuzzy search in title/description.
  - `sort_by` (string, optional): "created_at", "priority", "due_date".

### 3. `complete_task`

**Description**: Marks a task as completed.

- **Parameters**:
  - `task_id` (string, required): The ID of the task to complete.

### 4. `delete_task`

**Description**: Permanently removes a task.

- **Parameters**:
  - `task_id` (string, required): The ID of the task to delete.

### 5. `update_task`

**Description**: Modifies an existing task.

- **Parameters**:
  - `task_id` (string, required): The task ID.
  - `title` (string, optional): New title.
  - `priority` (string, optional): New priority.
  - `due_date` (string, optional): New due date.

## Interaction Flows

### Scenario: Recurring Task Creation

**User**: "Remind me to submit reports every Friday."
**Agent**:

1. Analyzes intent -> `add_task`.
2. Extracts arguments:
   - `title`: "Submit reports"
   - `is_recurring`: true
   - `recurrence_pattern`: "weekly"
   - `due_date`: Next Friday's date
3. Calls `add_task` tool.
4. Responds: "I've set a recurring task to submit reports every Friday."

### Scenario: Prioritization

**User**: "Show me my high priority work."
**Agent**:

1. Analyzes intent -> `list_tasks`.
2. Extracts arguments:
   - `priority`: "high"
   - `status`: "pending"
3. Calls `list_tasks` tool.
4. formats output list.

## Database Schema Mapping

Tools map directly to the `Task` SQLModel in `backend/models/task.py`.
