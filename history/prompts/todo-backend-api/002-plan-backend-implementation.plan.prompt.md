---
id: 002
title: plan-backend-implementation
stage: plan
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-backend-api
branch: 003-todo-backend-api
user: user
command: /sp.plan
labels: [backend, plan, fastapi, architecture, rest-api, jwt]
links:
  spec: specs/003-todo-backend-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-todo-backend-api/plan.md
 - specs/003-todo-backend-api/research.md
 - specs/003-todo-backend-api/data-model.md
 - specs/003-todo-backend-api/contracts/openapi.yaml
 - specs/003-todo-backend-api/quickstart.md
tests:
 - constitution-check
---

## Prompt

/sp.plan ---

## Objective
This plan defines the **step-by-step execution strategy** for building the **FastAPI backend** for Phase 2 of the Todo Application.

The backend will:
- Live entirely inside a `/backend` folder at the project root
- Expose REST APIs from a **single `main.py` file**
- Use **UV package manager**
- Follow **latest FastAPI documentation** via `context7` MCP
- Be easily connectable to the existing Next.js frontend

All work must follow **spec-driven development** and be generated via **Claude CLI**.

---

## Agent, Skill & MCP Configuration

### Required Agent
- **Agent:** `fastapi-backend-builder`

### Required Skill
- **Skill:** `backend-skill`

The agent must strictly follow `backend-skill` rules for:
- Clean FastAPI structure
- REST API best practices
- Secure authentication handling
- Database safety

---

### MCP Usage (Mandatory)
- **MCP:** `context7`

**Purpose**
- Use **latest FastAPI documentation**
- Follow modern dependency injection patterns
- Apply current SQLModel + PostgreSQL best practices
- Avoid deprecated APIs and outdated syntax

⚠️ All architectural and API decisions must be aligned with `context7`.

---

## Repository & Folder Setup

### Step 1: Create Backend Folder
At the project root, create:

/backend


⚠️ All FastAPI-related code must live **only inside this folder**.

---

## Environment & Package Management

### Step 2: Initialize Python Environment (UV)
Inside `/backend`:

- Initialize project using **UV package manager**
- Set Python version to **3.11+**
- Install required dependencies using UV:
  - fastapi
  - uvicorn
  - sqlmodel
  - psycopg / asyncpg
  - python-jose (or equivalent JWT library)
  - python-dotenv

**Acceptance Criteria**
- No pip or poetry usage
- Dependency versions are stable and modern

---

## Backend File Strategy

### Step 3: Single Entry File Rule
- All API routes, models, and logic must be implemented inside:
backend/main.py



Reason:
- Simplicity
- Easy review for judges
- Clear API visibility

⚠️ Do NOT split APIs into multiple route files.

---

## Application Initialization

### Step 4: FastAPI App Setup
In `main.py`:
- Initialize FastAPI app
- Configure CORS for frontend usage
- Load environment variables
- Setup database connection (Neon PostgreSQL)

**Acceptance Criteria**
- App runs successfully via uvicorn
- CORS allows frontend origin

---

## Database Configuration

### Step 5: PostgreSQL & SQLModel Setup
- Connect to **Neon PostgreSQL**
- Use **SQLModel** for all database models
- Create `User` and `Todo` models
- Setup table creation logic

⚠️ No raw SQL allowed.

---

## Authentication & Security

### Step 6: JWT Handling
Implement:
- JWT validation dependency
- Token extraction from `Authorization` header
- User identification from JWT payload

Rules:
- Never trust user_id from request body
- Always derive user identity from token

---

## API Implementation

### Step 7: Implement REST APIs (All in `main.py`)
Create protected endpoints:

GET /api/todos
POST /api/todos
GET /api/todos/{id}
PUT /api/todos/{id}
DELETE /api/todos/{id}
PATCH /api/todos/{id}/complete



Rules:
- All routes require JWT
- User can access only own todos
- Return proper HTTP status codes
- Return JSON responses only

---

## Error Handling

### Step 8: Robust Error Management
Handle:
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation errors
- 500 Server errors

Errors must return **structured JSON messages**.

---

## Frontend Integration Preparation

### Step 9: Frontend Compatibility
Ensure backend:
- Accepts requests from Next.js frontend
- Uses predictable response shapes
- Can be connected by changing only API base URL on frontend

---

## Validation & Testing

### Step 10: Final Validation Checklist
Backend is complete when:
- FastAPI app starts successfully
- All APIs work end-to-end
- JWT auth is enforced
- Todos persist in PostgreSQL
- User isolation is guaranteed
- Code follows latest FastAPI standards

---

## Rules & Constraints

- All code must be generated via **Claude CLI**
- Manual coding is ❌ not allowed
- All backend logic must exist in `/backend/main.py`
- `context7` MCP usage is mandatory
- Agent & skill usage must be respected

## Response snapshot

Created implementation plan and supporting artifacts for the Todo Backend API.
- **Plan**: `specs/003-todo-backend-api/plan.md` outlines the single-file FastAPI architecture.
- **Research**: `specs/003-todo-backend-api/research.md` confirms best practices for FastAPI, SQLModel interactions, and JWT auth.
- **Data Model**: `specs/003-todo-backend-api/data-model.md` defines User and Todo schemas with relationships and validation.
- **Contracts**: `specs/003-todo-backend-api/contracts/openapi.yaml` provides the strict API definition.
- **Quickstart**: `specs/003-todo-backend-api/quickstart.md` details environment setup commands using UV.

## Outcome

- ✅ Impact: Complete architectural blueprint ready for implementation tasks.
- 🧪 Tests: Constitution check passed (Test-First, Simplicity, Integration Testing).
- 📁 Files: Plan, Research, Data Model, Contracts, Quickstart docs.
- 🔁 Next prompts: /sp.tasks
- 🧠 Reflection: The strict constraint of a single `main.py` file simplified the architectural structure but required careful organization strategy in the research phase to ensure code remain maintainable. The use of UV package manager was incorporated effectively.

## Evaluation notes (flywheel)

- Failure modes observed: Missing `pwsh` environment forced manual execution of plan workflow steps.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Ensure fallback to bash scripts if detected in `setup-plan` or ensure environments are standardized.
