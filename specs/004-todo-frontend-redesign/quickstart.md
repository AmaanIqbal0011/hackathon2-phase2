# Quickstart Guide: Todo Frontend Redesign

## Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to backend API (running on localhost:8000 or configured endpoint)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local` if your backend runs on a different port.

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

## Key Features

### Landing Page (`/`)
- Professional SaaS-style marketing page
- Features grid showcasing product benefits
- How-it-works section
- Clear call-to-action buttons

### Dashboard (`/dashboard`)
- Protected route requiring authentication
- Sidebar navigation with key sections
- Statistics cards showing task metrics
- Task management with card-based UI
- Add task form for creating new tasks

### Authentication Flows
- Sign up at `/signup`
- Sign in at `/signin`
- Automatic redirection to dashboard after login
- Protected routes enforcement

## Component Structure

### UI Components
- `StatCard`: Displays task statistics with icon, value, and label
- `TaskCard`: Individual task display with completion toggle and actions
- `Sidebar`: Navigation sidebar with user menu and route links
- `Header`: Dashboard header with user greeting
- `AddTaskForm`: Inline form for adding new tasks

### Layout Structure
- Root layout in `app/layout.tsx`
- Dashboard layout in `app/dashboard/layout.tsx` (includes sidebar)
- Page-specific components in respective route folders

## Styling
- Tailwind CSS for all styling
- Responsive design using Tailwind's responsive utilities
- Consistent color scheme and typography
- Dark mode support (if implemented)

## API Integration
- Uses existing authentication patterns
- Maintains all current API endpoints
- Preserves JWT token handling in localStorage
- Continues to use axios for HTTP requests

## Development Commands

### Common Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

### Component Development
- Place new components in `src/components/ui/` for reusable UI elements
- Create form components in `src/components/forms/`
- Add utility functions to `src/lib/`

## Troubleshooting

### Common Issues
- **Authentication redirects not working**: Ensure API URL is correctly configured
- **Styling not applied**: Check that Tailwind CSS is properly imported in globals.css
- **API calls failing**: Verify backend server is running and URL is correct

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint (e.g., http://localhost:8000)
- `NEXT_PUBLIC_BACKEND_URL`: Alternative backend URL variable