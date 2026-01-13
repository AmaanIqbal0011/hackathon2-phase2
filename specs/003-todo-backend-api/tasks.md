# Tasks: Todo Backend API

**Feature Usage**: `003-todo-backend-api`
**Status**: Pending

## Dependencies

- [x] US1 (Authentication) must be completed before US2 (Todo Management)
- [x] US3 (Isolation) checks should be verified after US2

## Phase 1: Setup

**Goal**: Initialize the project structure and dependencies using UV.

- [x] T001 Create backend folder at project root `backend/`
- [x] T002 Initialize Python project with UV and install dependencies (`fastapi`, `uvicorn`, `sqlmodel`, `python-jose`, etc.) in `backend/pyproject.toml`
- [x] T003 Create `.env` file with placeholders in `backend/.env`

## Phase 2: Foundational

**Goal**: Bootstrap FastAPI app, database connection, and configuration.

- [x] T004 Create `backend/main.py` with FastAPI app initialization and health check route `backend/main.py`
- [x] T005 Configure CORS to allow frontend origin in `backend/main.py`
- [x] T006 Implement environment variable loading (Database URL, Secret Key) in `backend/main.py`
- [x] T007 Initialize SQLModel DB engine with async support in `backend/main.py`
- [x] T008 Implement idempotent table creation function in `backend/main.py`
- [x] T009 Implement centralized error handling (401, 403, 404, 500) JSON responses in `backend/main.py`

## Phase 3: User Story 1 (Authentication)

**Goal**: Implement user registration, login, and JWT validation.
**Independent Test**: User can register, login to get a token, and use that token to access a secured endpoint.

- [x] T010 [US1] Define `User` SQLModel in `backend/main.py`
- [x] T011 [US1] Implement password hashing and verification utilities in `backend/main.py`
- [x] T012 [US1] Implement `POST /auth/signup` endpoint in `backend/main.py`
- [x] T013 [US1] Implement `POST /auth/login` endpoint returning JWT in `backend/main.py`
- [x] T014 [US1] Implement `get_current_user` dependency with JWT validation in `backend/main.py`

## Phase 4: User Story 2 (Todo Management)

**Goal**: Implement CRUD operations for Todos.
**Independent Test**: Authenticated user can create, list, update, and delete their todos.

- [x] T015 [US2] Define `Todo` SQLModel in `backend/main.py`
- [x] T016 [US2] Define Pydantic models (Schema) for Todo Create/Update/Response in `backend/main.py`
- [x] T017 [US2] Implement `POST /api/todos` (Create Todo) in `backend/main.py`
- [x] T018 [US2] Implement `GET /api/todos` (List Todos) in `backend/main.py`
- [x] T019 [US2] Implement `GET /api/todos/{id}` (Get Single Todo) with ownership check in `backend/main.py`
- [x] T020 [US2] Implement `PUT /api/todos/{id}` (Update Todo) with ownership check in `backend/main.py`
- [x] T021 [US2] Implement `DELETE /api/todos/{id}` (Delete Todo) with ownership check in `backend/main.py`
- [x] T022 [US2] Implement `PATCH /api/todos/{id}/complete` (Mark Complete) in `backend/main.py`

## Phase 5: User Story 3 (Data Isolation & Security)

**Goal**: rigorous verification of data isolation.
**Independent Test**: Verify User A cannot access User B's data.

- [x] T023 [US3] Add strict tests/checks to ensure `user_id` is never taken from request body (Verify Implementation) in `backend/main.py`
- [x] T024 [US3] Verify `get_current_user` is used on ALL todo routes in `backend/main.py`

## Final Phase: Polish

**Goal**: Final verification and cleanup.

- [x] T025 Verify API contract matches frontend expectations (routes, response shapes) in `backend/main.py`
- [x] T026 Final End-to-End verification (Start server, run full manual flow test)

## Parallel Execution

- T012 (Signup) and T013 (Login) can be implemented in parallel after T010/T011.
- T017-T022 (Todo CRUD) can be implemented in parallel after T015/T016.

## Implementation Strategy

1. **Setup**: Get the environment running.
2. **Auth MVP**: Get users created and tokens issued.
3. **Core Features**: Build Todo CRUD one endpoint at a time.
4. **Hardening**: Review security and isolation.
