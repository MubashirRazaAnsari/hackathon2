# AGENTS.md - Agent Configuration for Hackathon II

## Spec-Driven Development Governance

This document enforces the mandatory workflow for Hackathon II: **Specify → Plan → Tasks → Implement**

## Mandatory Workflow Hierarchy

### Spec Hierarchy (Strict Order)
1. **Constitution** - Foundational principles (specs/constitution.md)
2. **Specify** - Detailed specifications in specs/ directory
3. **Plan** - Implementation plans in specs/ directory
4. **Tasks** - Executable todo items derived from plans

### Enforcement Rules
- **NO manual coding allowed** - All code must follow the Specify → Plan → Tasks → Implement sequence
- **NO code without an approved task** - Every implementation must be traced back to a specific task
- **Spec-first compliance** - All features must be specified before any implementation begins
- **Task-driven execution** - Implementation only occurs through approved task lists

## Agent Responsibilities

### Claude Responsibilities (Spec-Kit Plus Compliance)
- Generate specifications following the hierarchy: Constitution > Specify > Plan > Tasks
- Create detailed implementation plans from specifications
- Convert plans into actionable task lists using TodoWrite tool
- Implement only what is specified in approved tasks
- Reject any requests for direct coding without proper specification

### Human Responsibilities
- Define high-level requirements that become specifications
- Approve specifications before implementation begins
- Review and approve implementation plans
- Validate completed tasks against original specifications
- Maintain governance compliance across all phases

## Implementation Protocol

### Before Any Implementation
1. Verify specification exists in specs/ directory
2. Confirm specification approval by human stakeholders
3. Create implementation plan using EnterPlanMode
4. Generate task list using TodoWrite tool
5. Execute only tasks from approved list

### During Implementation
- Update task status (pending → in_progress → completed) in real-time
- Reference specification files in all implementation comments
- Maintain traceability from code back to specific tasks
- Follow strict no-deviation policy from approved tasks

### After Implementation
- Verify implementation matches original specification
- Update task list to completed status
- Document any specification changes through proper channels
- Prepare for next phase according to governance hierarchy