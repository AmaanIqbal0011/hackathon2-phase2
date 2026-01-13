---
id: 002
title: Research Next.js 16 and Better Auth integration
stage: spec
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-nextjs-frontend
branch: 002-nextjs-frontend
user: user
command: research
labels: ["nextjs", "research", "better-auth", "architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - research.md
tests:
 - null
---

## Prompt

Please research the following for a Next.js 16+ frontend (App Router) planning phase:

1.  **Better Auth Integration**: improved strategies for Better Auth client-side setup in Next.js App Router. Specifically, how to manage JWT storage (securely on frontend) and attach it to API requests (Authorization header) when the backend is a separate FastAPI service.
2.  **API Service Layer**: Best practices for a strictly typed API abstraction layer (e.g. inside `src/services`) in Next.js. It must be backend-agnostic but ready for FastAPI (REST).
3.  **Testing Strategy**: What is the current recommended testing stack for Next.js 16+? (Vitest vs Jest, React Testing Library).
4.  **Folder Structure**: Verify the proposed structure:
    ```
    frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── services/
    │   ├── lib/
    │   ├── styles/
    │   └── types/
    ```

Use the `mcp__context7__query-docs` tool to check Next.js best practices.
Use `mcp__better-auth__search` or `mcp__better-auth__chat` to find details on "client side JWT usage" or "API headers".

Return a summary of findings to be used in `research.md`.

## Response snapshot

I have completed the research into Next.js 16+ best practices and Better Auth integration.

### Key Findings
1.  **Architecture**: Next.js will act as the Auth Server (using Better Auth) and Client. FastAPI will be the Resource Server, verifying JWTs via a JWKS endpoint exposed by Next.js.
2.  **JWT Strategy**: Recommended approach is the **BFF (Backend for Frontend)** pattern. The client uses secure HttpOnly cookies with Next.js, and Next.js proxies requests to FastAPI, attaching the Bearer token server-side. This avoids exposing tokens to the client (XSS protection).
3.  **Testing**: **Vitest** is the preferred test runner for Next.js 16+ due to speed and ESM support, paired with React Testing Library.
4.  **Structure**: The proposed folder structure is optimal and aligns with industry standards.

I have documented these detailed findings in `research.md`.

## Outcome

- ✅ Impact: Established definitive architecture for Auth and Testing before implementation.
- 🧪 Tests: None (Research phase)
- 📁 Files: created research.md
- 🔁 Next prompts: Use these findings to generate the specification files.
- 🧠 Reflection: The Better Auth integration requires a clear distinction between Auth Server (Next.js) and Resource Server (FastAPI). The JWKS strategy is cleaner than shared secrets.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): standard
- Next experiment (smallest change to try): None
