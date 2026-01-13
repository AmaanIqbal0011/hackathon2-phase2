---
id: 001
title: create-backend-spec
stage: spec
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-backend-api
branch: 003-todo-backend-api
user: user
command: /sp.specify
labels: [backend, spec, rest-api, auth]
links:
  spec: specs/003-todo-backend-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-todo-backend-api/spec.md
 - specs/003-todo-backend-api/checklists/requirements.md
tests:
 - spec-validation
---

## Prompt

/sp.specify ---

## Project Context
This document specifies the **backend requirements** for **Phase 2 – Part 003** of the Todo Application.

The backend is responsible for:
- Exposing secure **REST APIs**
- Handling **authentication & authorization**
- Managing **persistent data storage**
- Serving as a clean, scalable backend that can be **easily connected to the existing Next.js frontend**

This backend must be built using **spec-driven development** and generated via **Claude CLI**, not manual coding.

---

## Agent, Skill & MCP Configuration

### Required Agent
- **Agent:** `fastapi-backend-builder`

### Required Skill
- **Skill:** `backend-skill`

### MCP Usage (Mandatory)
- **MCP:** `context7`

**Purpose of using context7 MCP**
- Follow **latest FastAPI best practices**
- Use modern dependency injection patterns
- Apply correct async / sync usage
- Follow PostgreSQL + SQLModel recommended patterns
- Avoid deprecated FastAPI APIs

---

## Technology Stack (Backend)

- **Framework:** FastAPI (latest stable)
- **Language:** Python 3.11+
- **Database:** Neon Serverless PostgreSQL
- **ORM:** SQLModel
- **Authentication:** JWT-based (frontend-compatible)
- **API Style:** REST
- **Environment Config:** `.env` variables

---

## High-Level Responsibilities

The backend must:
1. Provide secure REST APIs for Todo CRUD
2. Authenticate users via JWT
3. Authorize access (user can access only own data)
4. Persist data in PostgreSQL
5. Be easily consumable by the existing Next.js frontend

---

## Backend Folder & Project Structure

All backend code must live inside a dedicated folder:

/backend


Suggested structure:
backend/
├── app/
│ ├── main.py
│ ├── api/
│ ├── core/
│ ├── models/
│ ├── schemas/
│ ├── services/
│ └── db/
├── tests/
└── README.md


---

## API Design Principles

- RESTful endpoints
- JSON request/response
- Proper HTTP status codes
- Stateless APIs
- Clear separation of concerns

---

## Authentication & Authorization

### Authentication Model
- Backend must accept **JWT tokens**
- Token must be sent via:
Authorization: Bearer <token>


- Backend must validate:
- Token signature
- Token expiry
- User identity inside token

---

### Authorization Rules
- Every Todo is linked to a **user_id**
- A user can:
- Access ONLY their own todos
- Never read/update/delete another user’s data
- If `user_id` from JWT does not match resource owner → `403 Forbidden`

---

## Database Specification

### Database Provider
- **Neon PostgreSQL**

### ORM Rules
- Use **SQLModel only**
- No raw SQL
- Models must map clearly to tables

---

### Required Tables

#### Users
*(Minimal if auth is external)*

- `id` (UUID / string)
- `email`
- `created_at`

---

#### Todos
- `id` (int, primary key)
- `user_id` (string, indexed)
- `title` (string, required)
- `description` (text, optional)
- `completed` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## REST API Endpoints

### Base Path
/api



---

### Todo Endpoints (Protected)

GET /api/todos
POST /api/todos
GET /api/todos/{id}
PUT /api/todos/{id}
DELETE /api/todos/{id}
PATCH /api/todos/{id}/complete



---

## Request & Response Behavior

### Create Todo

**Request**
```json
{
  "title": "Learn FastAPI",
  "description": "Build backend for todo app"
}
Response

json
Copy code
{
  "id": 1,
  "title": "Learn FastAPI",
  "completed": false
}
Error Handling
Backend must handle:

Unauthorized access → 401

Forbidden access → 403

Not found → 404

Validation errors → 422

Server errors → 500

Errors must return clear, structured JSON.

Frontend Integration Contract
The backend must:

Enable CORS for frontend

Accept requests from Next.js

Return consistent response shapes

Allow frontend connection by changing only API base URL

Non-Goals (Out of Scope)
No frontend rendering

No UI logic

No GraphQL

No raw SQL



Security Considerations
JWT validation on every request

Never trust frontend-provided user_id

Input validation via Pydantic / SQLModel

Safe database access patterns

Success Criteria
Backend is complete when:

All Todo APIs work correctly

JWT auth is enforced

Data persists in PostgreSQL

Users are fully isolated

Frontend connects without refactoring

Code follows modern FastAPI standards

Implementation Rules
Code must be generated via Claude CLI

Manual coding is not allowed

Specs must be refined if output is incorrect

Agent, skill, and MCP usage must be respected

## Response snapshot

Created feature branch `003-todo-backend-api` and specification file at `specs/003-todo-backend-api/spec.md`. The specification captures all requirements including authentication, CRUD operations, and data isolation. Technical constraints were separated from functional requirements as per spec guidelines.

## Outcome

- ✅ Impact: Established clear backend requirements and quality gates for Phase 2 implementation.
- 🧪 Tests: Validated spec against quality checklist (specs/003-todo-backend-api/checklists/requirements.md).
- 📁 Files: Created `spec.md` and `checklists/requirements.md`.
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: The prompt was highly specific about technology stack, which required careful handling during spec creation to separate functional requirements from technical constraints while respecting the user's specific choices.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): None
