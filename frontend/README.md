# Todo App - Professional SaaS-Style Frontend

This is a professional SaaS-style task management application with a modern UI/UX, featuring a marketing landing page and a comprehensive dashboard.

## Features

- **Marketing Landing Page** (`/`): Professional landing page with hero section, features grid, how-it-works section, and call-to-action
- **Protected Dashboard** (`/dashboard`): SaaS-style dashboard with sidebar navigation, statistics cards, and task management
- **Modern UI Components**: Statistics cards, task cards with hover actions, inline add form
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Authentication**: Secure authentication flow with login/signup pages
- **Task Management**: Add, edit, delete, and mark tasks as complete with visual feedback

## Pages

- `/` - Landing page introducing the product professionally
- `/dashboard` - Protected dashboard with sidebar navigation
- `/signin` - User sign-in page
- `/signup` - User registration page

## Tech Stack

- Next.js 16+ with App Router
- React
- TypeScript
- Tailwind CSS
- Axios for API requests

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The application follows a component-based architecture with:

- **Components**: Reusable UI elements in `src/components/`
  - `ui/` - General UI components (StatCard, TaskCard, Sidebar, Header)
  - `forms/` - Form components (AddTaskForm)
  - `landing/` - Landing page specific components
  - `dashboard/` - Dashboard specific components

- **Libraries**: Utility functions and constants in `src/lib/`
  - `auth.ts` - Authentication utilities
  - `tasks.ts` - Task-related utilities
  - `types.ts` - TypeScript type definitions
  - `constants.ts` - Application constants

- **Pages**: Next.js App Router pages in `src/app/`
  - `page.tsx` - Landing page
  - `dashboard/` - Dashboard layout and page
  - `signin/` and `signup/` - Authentication pages

## API Integration

The application integrates with the existing backend API without changes, preserving all authentication and task management endpoints.

## Development

This project was generated using the Specify framework with Spec-Driven Development methodology.
