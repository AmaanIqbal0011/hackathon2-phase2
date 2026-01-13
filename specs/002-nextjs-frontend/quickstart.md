# Quickstart: Next.js Frontend

## Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

## Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Configure `NEXT_PUBLIC_API_URL` to point to your backend service (e.g., `http://localhost:8000`).

## Development

- **Start Dev Server**:
  ```bash
  npm run dev
  ```
  Access at `http://localhost:3000`.

- **Run Tests**:
  ```bash
  npm test
  ```

- **Lint**:
  ```bash
  npm run lint
  ```

## Project Structure
- `src/app`: Page routes
- `src/components`: UI components
- `src/services`: API client layer

## Common Tasks

### Adding a new page
Create a new folder in `src/app` with a `page.tsx`.

### Adding a new API call
1. Add types to `src/types`.
2. Add a function to `src/services/api.ts` or specific service file.
3. Use in component.
