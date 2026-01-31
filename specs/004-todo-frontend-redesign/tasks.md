# Tasks: Todo Frontend Redesign

**Feature**: Todo Frontend Redesign
**Branch**: `004-todo-frontend-redesign`
**Generated**: 2026-01-29
**Input**: Design documents from `/specs/004-todo-frontend-redesign/`

## Implementation Strategy

This task breakdown implements a professional SaaS-style frontend redesign with a marketing landing page and enhanced dashboard. The approach follows the user story priorities (P1, P2, P3) to enable incremental delivery and independent testing. Each phase builds upon the previous to create a complete, testable increment.

## Dependencies

- User Story 1 (Landing Page) → Independent
- User Story 2 (Dashboard) → Depends on foundational auth components
- User Story 3 (Task Management) → Depends on dashboard layout and UI components
- User Story 4 (Empty State & Responsive) → Depends on core dashboard functionality

## Parallel Execution Opportunities

- UI components (StatCard, TaskCard, Sidebar, AddTaskForm) can be developed in parallel [P]
- Landing page sections (Hero, Features, How It Works) can be developed in parallel [P]
- Dashboard layout and statistics calculations can be developed in parallel [P]

---

## Phase 1: Setup

Initial project setup and foundational components that will be used across user stories.

- [X] T001 Set up project structure per implementation plan in frontend/src/
- [X] T002 [P] Create UI components directory structure in frontend/src/components/ui/
- [X] T003 [P] Create forms components directory structure in frontend/src/components/forms/
- [ ] T004 [P] Update globals.css with Tailwind configurations in frontend/src/app/globals.css
- [X] T005 Create reusable constants for navigation items in frontend/src/lib/constants.ts

---

## Phase 2: Foundational Components

Core components and utilities that block user story implementation.

- [X] T010 Create StatCard component in frontend/src/components/ui/StatCard.tsx
- [X] T011 Create TaskCard component in frontend/src/components/ui/TaskCard.tsx
- [X] T012 Create Sidebar component in frontend/src/components/ui/Sidebar.tsx
- [X] T013 Create AddTaskForm component in frontend/src/components/forms/AddTaskForm.tsx
- [X] T014 Create Header component in frontend/src/components/ui/Header.tsx
- [X] T015 [P] Implement task statistics calculation utilities in frontend/src/lib/tasks.ts
- [X] T016 [P] Create navigation constants in frontend/src/lib/navigation.ts
- [X] T017 [P] Create authentication utilities to preserve existing flow in frontend/src/lib/auth.ts

---

## Phase 3: User Story 1 - Visit Landing Page and Learn About Product (Priority: P1)

A new visitor lands on the homepage and learns about the product before deciding whether to sign up. The user should be able to understand the product's value proposition, key features, and how to get started.

**Independent Test**: The landing page should effectively communicate the product's value and encourage signups, measurable by conversion rates from visitors to registered users.

**Acceptance Scenarios**:
1. Given a user visits the homepage, When they view the page content, Then they see a clear hero section with app name, tagline, and clear CTAs to sign up or log in
2. Given a user scrolls down the landing page, When they view the features grid, Then they see 4 feature cards highlighting Smart Task Management, Secure Authentication, Cloud Backend, and AI Ready Architecture
3. Given a user views the "How It Works" section, When they read the content, Then they understand the simple 3-step process to get started with the product

- [X] T020 [P] [US1] Create hero section component in frontend/src/components/landing/HeroSection.tsx
- [X] T021 [P] [US1] Create features grid component in frontend/src/components/landing/FeaturesGrid.tsx
- [X] T022 [P] [US1] Create how-it-works section component in frontend/src/components/landing/HowItWorks.tsx
- [X] T023 [P] [US1] Create call-to-action component in frontend/src/components/landing/CallToAction.tsx
- [ ] T024 [P] [US1] Create landing page layout in frontend/src/app/layout.tsx (update existing)
- [X] T025 [US1] Create landing page at frontend/src/app/page.tsx
- [X] T026 [US1] Style landing page with gradient hero and Tailwind CSS per spec
- [X] T027 [US1] Implement responsive design for landing page across mobile/tablet/desktop

---

## Phase 4: User Story 2 - Access Protected Dashboard After Authentication (Priority: P1)

An authenticated user accesses the dashboard to manage their tasks with a professional SaaS-style interface featuring statistics, sidebar navigation, and responsive design.

**Independent Test**: Users should be able to access the dashboard after authentication and see their tasks with improved UI/UX compared to the previous version.

**Acceptance Scenarios**:
1. Given a user is logged in, When they navigate to `/dashboard`, Then they see the protected dashboard with sidebar navigation and statistics cards
2. Given a user is on the dashboard, When they view the statistics row, Then they see 3 cards showing Total Tasks, Active Tasks, and Completed Tasks with icons
3. Given a user is on the dashboard, When they interact with the sidebar navigation, Then they can navigate between Dashboard, All Tasks, Completed, and Logout

- [X] T030 [P] [US2] Create dashboard layout with sidebar in frontend/src/app/dashboard/layout.tsx
- [X] T031 [P] [US2] Create statistics cards container in frontend/src/components/dashboard/StatisticsContainer.tsx
- [X] T032 [US2] Create dashboard page at frontend/src/app/dashboard/page.tsx
- [X] T033 [US2] Implement sidebar navigation with Logo, Dashboard, All Tasks, Completed, Logout in Sidebar component
- [X] T034 [US2] Display statistics cards showing Total Tasks, Active Tasks, Completed Tasks with icons
- [X] T035 [US2] Implement authentication check to redirect unauthenticated users from dashboard
- [X] T036 [US2] Preserve existing authentication flow and JWT token handling
- [X] T037 [US2] Connect statistics to existing task API for data retrieval

---

## Phase 5: User Story 3 - Manage Tasks with Enhanced UI Components (Priority: P2)

A user manages their tasks using the new UI components including task cards, inline add form, filters, and improved visual design that enhances productivity.

**Independent Test**: Users should be able to add, edit, delete, and mark tasks as complete using the new UI components with better visual feedback than the previous version.

**Acceptance Scenarios**:
1. Given a user is on the dashboard, When they use the inline add task form, Then they can add a new task with title and description
2. Given a user has tasks displayed as cards, When they view the task cards, Then each card shows checkbox, title, description, status badge, and action buttons
3. Given a user has completed tasks, When they view the dashboard, Then completed tasks appear faded with visual distinction from active tasks
4. Given a user wants to filter tasks, When they use the search input and status dropdown, Then the task list updates accordingly

- [X] T040 [P] [US3] Update AddTaskForm component to include title and description fields in frontend/src/components/forms/AddTaskForm.tsx
- [X] T041 [P] [US3] Enhance TaskCard component with checkbox, title, description, status badge, edit, delete in frontend/src/components/ui/TaskCard.tsx
- [X] T042 [P] [US3] Create filter controls component in frontend/src/components/dashboard/FilterControls.tsx
- [X] T043 [US3] Implement inline add task form in dashboard page
- [X] T044 [US3] Replace simple task list with card-based UI using TaskCard component
- [X] T045 [US3] Apply visual distinction to completed tasks (fade effect)
- [X] T046 [US3] Implement hover effects to show actions on task cards
- [X] T047 [US3] Add search input and status dropdown filters for tasks
- [X] T048 [US3] Connect add task form to existing POST /api/todos endpoint
- [X] T049 [US3] Connect task card actions to existing API endpoints (toggle complete, delete)

---

## Phase 6: User Story 4 - Experience Empty State and Responsive Design (Priority: P3)

A user encounters the empty state when they have no tasks and experiences the responsive design across different device sizes.

**Independent Test**: Users should have a positive experience even when they have no tasks and should be able to use the application effectively on mobile, tablet, and desktop.

**Acceptance Scenarios**:
1. Given a user has no tasks, When they view the dashboard, Then they see the empty state message "You're all caught up 🎉" with an "Add Task" button
2. Given a user accesses the application on different screen sizes, When they navigate the interface, Then the layout adapts responsively maintaining usability

- [X] T050 [US4] Create empty state component in frontend/src/components/dashboard/EmptyState.tsx
- [X] T051 [US4] Implement empty state display logic in dashboard page
- [X] T052 [US4] Show "You're all caught up 🎉" message with Add Task button when no tasks exist
- [X] T053 [US4] Implement responsive design for dashboard sidebar (collapse on mobile)
- [X] T054 [US4] Implement responsive design for task cards (stack on small screens)
- [X] T055 [US4] Test responsive behavior across mobile (320px), tablet, and desktop (1920px+) screen sizes

---

## Phase 7: Polish & Cross-Cutting Concerns

Final touches and quality improvements across the application.

- [X] T060 Add subtle hover animations to UI components for better UX
- [X] T061 Ensure consistent spacing and typography throughout application
- [X] T062 Add proper loading states for API calls in dashboard
- [X] T063 Add error handling and user-friendly messages for API failures
- [X] T064 Update meta tags and SEO elements for landing page
- [X] T065 Verify all existing authentication functionality remains intact
- [X] T066 Verify all backend API integrations remain unchanged
- [X] T067 Conduct final testing of all user stories and acceptance scenarios
- [X] T068 Update README with new features and usage instructions

---

## MVP Scope

The minimum viable product includes:
- User Story 1: Landing page with hero, features, and CTA
- User Story 2: Protected dashboard with sidebar and statistics
- Basic task management functionality with new UI components

This provides a complete user journey from landing page to authenticated dashboard with core task functionality.