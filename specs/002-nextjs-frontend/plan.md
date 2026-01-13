# Implementation Plan: Setup Next.js Frontend

**Branch**: `002-nextjs-frontend` | **Date**: 2026-01-08 | **Spec**: [specs/002-nextjs-frontend/spec.md](specs/002-nextjs-frontend/spec.md)
**Input**: Feature specification from `/specs/002-nextjs-frontend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The goal is to implement a modern, responsive frontend for the Todo application using Next.js 16+ (App Router). This includes setting up the project structure, implementing authentication flows (Login, Signup) using Better Auth (via BFF pattern where possible or direct client if needed for separated backend), creating a protected Dashboard for Task CRUD operations, and ensuring a robust API service layer that decouples the UI from the backend.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**: Next.js 16+ (App Router), React 19, Better Auth, Tailwind CSS, Zod (validation)
**Storage**: Secure Cookies (Auth), LocalStorage (Preferences)
**Testing**: Vitest, React Testing Library (Unit/Component), Playwright (E2E - optional for this phase)
**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web Application (Frontend only in this repo context, communicating with external FastAPI)
**Performance Goals**: First Contentful Paint < 1.5s, Time to Interactive < 3s, Interaction to Next Paint < 200ms
**Constraints**: Mobile-first responsive design (375px+), Client-side input validation, Strict separation of API logic
**Scale/Scope**: ~3 core pages (Login, Signup, Dashboard), ~5-10 reusable components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle 1**: Library-First - *N/A (Application code, but components will be modular)*
- **Principle 2**: CLI Interface - *N/A (Web UI)*
- **Principle 3**: Test-First - **Compliant** (Vitest setup prior to feature impl)
- **Principle 4**: Integration Testing - **Compliant** (Service layer will have contract tests)
- **Principle 5**: Observability - **Compliant** (Error boundaries and logging abstractions)

## Project Structure

### Documentation (this feature)

```text
specs/002-nextjs-frontend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Route group for auth pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/       # Protected dashboard route
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page (redirects to dashboard or login)
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Generic UI elements (Button, Input, etc.)
│   │   ├── forms/           # Specific form components
│   │   └── features/        # Feature-specific components (TaskList, TaskItem)
│   ├── services/            # API communication layer
│   │   ├── api.ts           # Core HTTP client
│   │   └── taskService.ts   # Task-related API calls
│   ├── lib/                 # Helpers and utilities
│   │   ├── auth.ts          # Authentication utilities
│   │   └── utils.ts         # General utilities
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
└── tests/                   # Test configuration and files
```

**Structure Decision**: Selected the "Web application" structure, isolating all frontend code into a `frontend/` directory to maintain clean separation from any future backend code and adhering to Next.js best practices.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None*    |            |                                     |
