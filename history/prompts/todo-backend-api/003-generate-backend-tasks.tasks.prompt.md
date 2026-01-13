---
id: 003
title: generate-backend-tasks
stage: tasks
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-backend-api
branch: 003-todo-backend-api
user: user
command: /sp.tasks
labels: [tasks, execution-plan, backend, fastapi]
links:
  spec: specs/003-todo-backend-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-todo-backend-api/tasks.md
tests:
 - task-completeness-check
---

## Prompt

/sp.tasks ---

## Purpose
This task list provides a **clear, step-by-step execution guide** for Claude CLI to build a **fully working FastAPI backend** for the Phase 2 Todo Application.

The tasks are designed so that:
- All APIs work correctly
- JWT authentication is enforced
- Data persists in PostgreSQL
- Backend connects seamlessly to the Next.js frontend
- Code quality matches professional standards

---

## Global Execution Rules

- **Agent:** `fastapi-backend-builder`
- **Skill:** `backend-skill`
- **MCP:** `context7` (mandatory for latest FastAPI docs)
- **Package Manager:** `uv`
- **Python Version:** 3.11+
- **Backend Folder:** `/backend`
- **Single File Rule:** All logic must be in `backend/main.py`
- **Manual coding:** ❌ Not allowed

---

## Task Group 1: Backend Environment Setup

### Task 1.1 — Create Backend Folder
- Create `/backend` at the project root
- Ensure all backend-related files live inside this folder

---

### Task 1.2 — Initialize Python Project with UV
Inside `/backend`:
- Initialize a Python project using **uv**
- Set Python version to **3.11+**
- Create `.env` support

Install dependencies:
- `fastapi`
- `uvicorn`
- `sqlmodel`
- `psycopg` or `asyncpg`
- `python-jose` (JWT)
- `python-dotenv`

**Acceptance Criteria**
- No pip or poetry usage
- Dependencies are installed via uv only

---

## Task Group 2: FastAPI App Bootstrap

### Task 2.1 — Create main.py
- Create `backend/main.py`
- Initialize FastAPI application
- Add basic health check route

---

### Task 2.2 — Configure CORS
- Enable CORS for frontend
- Allow frontend origin via environment variable
- Allow credentials, headers, and methods

**Acceptance Criteria**
- Frontend can call APIs without CORS errors

---

## Task Group 3: Environment & Configuration

### Task 3.1 — Load Environment Variables
- Load database URL from `.env`
- Load JWT secret & algorithm
- Load frontend origin

**Acceptance Criteria**
- App fails gracefully if required env vars are missing

---

## Task Group 4: Database Setup (SQLModel + PostgreSQL)

### Task 4.1 — Database Engine Initialization
- Create SQLModel engine for Neon PostgreSQL
- Configure connection pooling correctly
- Use latest SQLModel patterns (via context7)

---

### Task 4.2 — Define Database Models
Inside `main.py`, define:
- `User` model (minimal)
- `Todo` model with:
  - id
  - user_id
  - title
  - description
  - completed
  - created_at
  - updated_at

**Acceptance Criteria**
- Models map correctly to PostgreSQL tables

---

### Task 4.3 — Create Tables
- Implement table creation logic on app startup
- Ensure idempotent behavior

---

## Task Group 5: Authentication & Security

### Task 5.1 — JWT Dependency
- Implement JWT decoding & validation dependency
- Extract `user_id` from token payload
- Handle expired or invalid tokens

**Acceptance Criteria**
- Invalid or missing token → `401 Unauthorized`

---

### Task 5.2 — Authorization Enforcement
- Ensure all Todo operations use `user_id` from JWT
- Never accept `user_id` from request body

**Acceptance Criteria**
- Cross-user access is impossible

---

## Task Group 6: API Schemas (Request & Response)

### Task 6.1 — Define Pydantic Schemas
Define schemas for:
- TodoCreate
- TodoUpdate
- TodoResponse

**Acceptance Criteria**
- Input validation works correctly
- Responses are consistent

---

## Task Group 7: Todo CRUD APIs (All in main.py)

### Task 7.1 — Create Todo API
- Implement `POST /api/todos`
- Create todo linked to authenticated user

---

### Task 7.2 — Get All Todos API
- Implement `GET /api/todos`
- Return only authenticated user’s todos

---

### Task 7.3 — Get Single Todo API
- Implement `GET /api/todos/{id}`
- Ensure ownership validation

---

### Task 7.4 — Update Todo API
- Implement `PUT /api/todos/{id}`
- Allow title & description update only

---

### Task 7.5 — Delete Todo API
- Implement `DELETE /api/todos/{id}`
- Permanently remove todo

---

### Task 7.6 — Mark Todo Complete API
- Implement `PATCH /api/todos/{id}/complete`
- Toggle completed status

**Acceptance Criteria (All APIs)**
- JWT required
- Proper status codes
- JSON responses
- User isolation enforced

---

## Task Group 8: Error Handling & Responses

### Task 8.1 — Centralized Error Handling
Handle:
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation errors
- 500 Internal errors

**Acceptance Criteria**
- Errors return clear JSON messages
- No stack traces exposed

---

## Task Group 9: Frontend Integration Readiness

### Task 9.1 — API Contract Verification
Ensure:
- Endpoints match frontend expectations
- Response formats are stable
- API base path is configurable

---

### Task 9.2 — CORS & Auth Validation
- Test APIs with Authorization header
- Confirm frontend can call APIs successfully

---

## Task Group 10: Final Validation

### Task 10.1 — End-to-End Verification
Backend is complete when:
- FastAPI server runs without errors
- All APIs respond correctly
- JWT auth is enforced
- Data persists in Neon PostgreSQL
- Frontend can connect without changes

---

## Final Instruction to Claude CLI

> Execute all tasks using **agent `fastapi-backend-builder`**, **skill `backend-skill`**, and **context7 MCP**, ensuring the final backend is **secure, production-ready, and fully compatible with the Next.js frontend**.

## Response snapshot

Generated comprehensive task list in `specs/003-todo-backend-api/tasks.md`.
The tasks follow SDD phases:
- **Phase 1 & 2**: Setup and Foundation (UV, FastAPI, DB Engine).
- **Phase 3**: User Story 1 (Auth) - Added specific endpoints for Signup/Login to satisfy implementation needs.
- **Phase 4**: User Story 2 (Todo CRUD) - Comprehensive breakdown of all endpoints.
- **Phase 5**: User Story 3 (Isolation) - Verification tasks.
- **Final**: Polish and Verification.

## Outcome

- ✅ Impact: Actionable, step-by-step guide for building the backend.
- 🧪 Tests: Tasks are organized by user story for independent verification.
- 📁 Files: `tasks.md`
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: The input task groups were very detailed but missing explicit Auth Endpoints (Signup/Login) in the lists, though implying them via JWT requirements. I added specific tasks for them to ensuring a working system.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): None
