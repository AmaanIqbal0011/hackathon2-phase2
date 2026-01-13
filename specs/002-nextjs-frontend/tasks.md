---
description: "Task list for Next.js Frontend Implementation"
---

# Tasks: Setup Next.js Frontend

**Input**: Design documents from `/specs/002-nextjs-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create frontend directory at frontend/
- [X] T002 Initialize Next.js project with TypeScript, Tailwind, App Router in frontend/
- [X] T003 [P] Configure project aliases and cleanup default page content in frontend/src/app/page.tsx
- [X] T004 [P] Setup environment variables (NEXT_PUBLIC_API_URL) in frontend/.env.local

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create types directory and base types (User, Task, AuthToken) in frontend/src/types/index.ts
- [X] T006 Implement API Service abstraction base class in frontend/src/services/api.ts
- [X] T007 [P] Install and configure Better Auth client in frontend/src/lib/auth-client.ts
- [X] T008 [P] Setup Vitest and React Testing Library in frontend/vitest.config.ts
- [X] T009 Create basic UI components (Button, Input, Card) in frontend/src/components/ui/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can sign up for a new account and log in to access their protected dashboard.

**Independent Test**: Can be verified by creating a new account via the signup form, then logging out and logging back in.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create Auth Service methods (login, signup, logout) in frontend/src/services/auth.ts
- [X] T011 [P] [US1] Create Signup Form component in frontend/src/components/auth/SignupForm.tsx
- [X] T012 [P] [US1] Create Login Form component in frontend/src/components/auth/LoginForm.tsx
- [X] T013 [US1] Implement Signup Page in frontend/src/app/(auth)/signup/page.tsx
- [X] T014 [US1] Implement Login Page in frontend/src/app/(auth)/login/page.tsx
- [X] T015 [US1] Implement Route Protection (Middleware/HOC) in frontend/src/middleware.ts
- [X] T016 [US1] Verify Auth Flow integration (Redirects to dashboard)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Dashboard Task Management (Priority: P2)

**Goal**: Authenticated users can view, create, edit, delete, and complete todo tasks on their dashboard.

**Independent Test**: Can be tested by a logged-in user performing the full lifecycle of a task.

### Implementation for User Story 2

- [X] T017 [P] [US2] Create Task Service methods (get, create, update, delete) in frontend/src/services/tasks.ts
- [X] T018 [P] [US2] Create Task Item component in frontend/src/components/tasks/TaskItem.tsx
- [X] T019 [P] [US2] Create Task List component in frontend/src/components/tasks/TaskList.tsx
- [X] T020 [P] [US2] Create Add Task Form component in frontend/src/components/tasks/AddTaskForm.tsx
- [X] T021 [US2] Implement Dashboard Page logic in frontend/src/app/dashboard/page.tsx
- [X] T022 [US2] Integrate Task components into Dashboard
- [X] T023 [US2] Implement Task Update/Delete actions in TaskItem

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Visual Feedback & Error Handling (Priority: P3)

**Goal**: Users receive immediate visual feedback for actions (loading states) and clear error messages when operations fail.

**Independent Test**: Can be verified by triggering network errors or validation errors.

### Implementation for User Story 3

- [X] T024 [P] [US3] Create Toast/Notification component in frontend/src/components/ui/Toast.tsx
- [X] T025 [P] [US3] Create Loading Spinner component in frontend/src/components/ui/Spinner.tsx
- [X] T026 [US3] Improve API Error handling in frontend/src/services/api.ts to trigger Toasts
- [X] T027 [US3] Add loading states to Login/Signup forms
- [X] T028 [US3] Add loading states to Task actions (Add, Delete, Update)
- [X] T029 [US3] Create Empty State component for Task List in frontend/src/components/tasks/EmptyState.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T030 [P] Validate Responsive Design breakdown points
- [X] T031 Run Accessibility audit (Lighthouse)
- [X] T032 Final code cleanup and strict type checks
- [X] T033 Verify alignment with Contracts


---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses Auth context from US1 but can rely on mocked auth or types if paralleled
- **User Story 3 (P3)**: Enhances US1 and US2 - Best done after functional logic is in place

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Form components implementation can be parallelized
- Service definition can be parallelized with Component creation (using types)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
