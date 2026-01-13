---
id: "001"
title: "Setup Better Auth Client"
stage: "implementation"
date: "2026-01-08"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "nextjs-frontend"
branch: "002-nextjs-frontend"
user: "user"
command: "install better-auth"
labels: ["frontend", "auth", "setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/package.json"
  - "frontend/src/lib/auth-client.ts"
tests: []
---

# User Prompt
Please install `better-auth` in the `frontend` directory.
Then create `frontend/src/lib/auth-client.ts` configured for the Next.js App Router client.

Configuration:
- baseURL should come from env var (NEXT_PUBLIC_BASE_URL) or default to localhost:3000 (Next.js server) because Better Auth runs on the Next.js server (BFF).
- Use `createAuthClient` from `better-auth/react`.

Dependencies to install: `better-auth`.

# Assistant Response
I successfully installed `better-auth` in the `frontend` directory and created the `frontend/src/lib/auth-client.ts` file configured for the Next.js App Router client with the specified base URL handling.

Files created:
- `frontend/src/lib/auth-client.ts`

Dependencies installed:
- `better-auth` (in frontend)
