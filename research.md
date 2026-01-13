# Next.js 16+ & Better Auth Research Findings

## 1. Authentication Architecture (Next.js + FastAPI)

Since the backend is Python (FastAPI) and Better Auth is a TypeScript/Node.js solution, the architecture must be split into **Auth Server** (Next.js) and **Resource Server** (FastAPI).

### Integration Strategy: JWKS (JSON Web Key Set)
This is the standard for microservice authentication.
1.  **Next.js (Auth Server)**:
    *   Install `better-auth`.
    *   Enable the `jwt` plugin.
    *   This exposes a standard endpoint (typically `/api/auth/jwks`) containing public keys.
2.  **FastAPI (Resource Server)**:
    *   Verify incoming tokens against the JWKS endpoint provided by Next.js.
    *   Does NOT need to share a database or secret key with Next.js, maintaining clean separation.

### Token Management Strategies
There are two ways to handle the JWTs on the client:

#### **Option A: Backend for Frontend (BFF) - Recommended for Security**
*   **How**: Client -> Next.js Route Handler -> FastAPI.
*   **Storage**: Browser stores an `HttpOnly` cookie (handled automatically by Better Auth).
*   **Flow**:
    1.  Client makes request to `src/app/api/tasks/route.ts`.
    2.  Next.js Server Component/Route Handler reads the session using `auth.api.getSession({ headers })`.
    3.  Next.js Server extracts the User ID or signs a fresh JWT.
    4.  Next.js Server calls FastAPI with `Authorization: Bearer <token>`.
*   **Pros**: Token never exposed to Client JS (XSS safe). No CORS issues between Browser and FastAPI.

#### **Option B: Direct Access (Client -> FastAPI)**
*   **How**: Client -> FastAPI.
*   **Storage**: `localStorage` or In-Memory.
*   **Config**: Use Better Auth `bearer` plugin.
*   **Flow**:
    1.  On login, `authClient` returns a token (or retrieves via `authClient.token()`).
    2.  Token is saved in React Context or LocalStorage.
    3.  `src/services/api.ts` attaches `Authorization: Bearer <token>` to requests.
*   **Pros**: Less load on Next.js server (skip proxying).
*   **Cons**: Less secure (XSS risk), requires CORS config on FastAPI.

**Decision**: The plan supports **Option A** (BFF) for sensitive operations, but the codebase will be structured to allow Option B if performance dictates.

## 2. API Service Layer (`src/services`)

Best practice for Next.js 16 is a **Typed Service Layer**.

*   **Technology**: Standard `fetch` (native to Next.js for caching support) wrapped in a typed client.
*   **Structure**:
    ```typescript
    // src/services/api-client.ts
    // Handles base URL, headers, and error normalization

    // src/services/tasks.ts
    // Domain specific methods using api-client
    export const taskService = {
      getAll: async (): Promise<Task[]> => { ... },
      create: async (data: CreateTaskDto): Promise<Task> => { ... }
    }
    ```
*   **Validation**: Use **Zod** to validate API responses match expected Types.

## 3. Testing Strategy

*   **Runner**: **Vitest** (Faster, easier config than Jest).
*   **Components**: **React Testing Library**.
*   **E2E**: Playwright (for flows involving Auth).
*   **Note**: Async Server Components are hard to unit test. Strategy is to abstract logic into `.ts` files (testable with Vitest) or use E2E for the full page render.

## 4. Folder Structure (Verified)

The proposed structure is standard. Refined version:

```text
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Route Group for auth pages
│   │   ├── (dashboard)/     # Protected routes
│   │   ├── api/             # Route Handlers (BFF Proxy)
│   ├── components/
│   │   ├── ui/              # Shadcn/Radix primitives
│   │   ├── forms/           # Complex forms with validation
│   ├── services/            # API definitions
│   ├── lib/                 # Singletons (auth-client, db)
│   ├── styles/              # Global css
│   └── types/               # Zod schemas & TS Interfaces
├── tests/                   # Vitest setup
```
