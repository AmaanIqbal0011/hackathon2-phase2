---
id: "001"
title: "Fix GetCurrentUser Returning Null"
stage: "general"
date_iso: "2026-01-31"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "004-todo-frontend-redesign"
user: "dell"
command: "manual-fix"
labels: ["authentication", "jwt", "frontend", "debugging", "nextjs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "frontend/src/lib/auth.ts"
  - "frontend/src/app/signin/page.tsx"
  - "frontend/src/app/dashboard/page.tsx"
  - "frontend/src/app/dashboard/layout.tsx"
  - "backend/main.py"
tests_yaml:
  - "none"
---

# Fix GetCurrentUser Returning Null

## Context
User reported that `getCurrentUser()` function in Next.js frontend always returns null despite successful authentication and JWT token generation in FastAPI backend. Backend functionality (signup, login, JWT generation, todos) works correctly, but frontend authentication state management is broken.

## Problem
- `getCurrentUser()` in `lib/auth.ts` returns null consistently
- JWT token is stored in localStorage but user profile data is not
- Frontend relies on localStorage keys that are never set after login
- No user profile endpoint existed in backend

## Solution Implemented
### Backend Changes
- Added `/api/profile` endpoint to fetch current user profile information from database
- Endpoint uses existing `get_current_user` dependency to authenticate and return user details

### Frontend Changes
- Enhanced `lib/auth.ts` with proper JWT token decoding functionality
- Updated `getCurrentUser()` to first check localStorage, then fall back to token decoding
- Added `fetchAndStoreUserProfile()` to retrieve user data from backend API
- Added `getCurrentUserWithProfile()` that ensures user data availability
- Added `authenticatedFetch()` helper for consistent API calls
- Modified sign-in page to fetch and store user profile after login
- Updated dashboard page to use enhanced authentication functions
- Updated dashboard layout to properly fetch user data asynchronously

## Key Technical Details
- JWT decoding implementation properly handles Base64 URL-safe encoding
- Token expiration checking integrated
- Proper import paths for auth utilities in all components
- Consistent authorization header format (`Bearer ${token}`)
- UUID handling from JWT "sub" field to user ID

## Files Modified
- `frontend/src/lib/auth.ts` - Enhanced authentication utilities
- `frontend/src/app/signin/page.tsx` - Fetch user profile after login
- `frontend/src/app/dashboard/page.tsx` - Use enhanced auth functions
- `frontend/src/app/dashboard/layout.tsx` - Proper async user loading
- `backend/main.py` - Added user profile endpoint

## Outcome
- `getCurrentUser()` now returns logged-in user consistently
- User profile data is properly stored and retrieved from localStorage
- JWT token is correctly decoded when localStorage is unavailable
- Authentication flow works end-to-end from signup/login to dashboard

## Tests Summary
Manual verification of authentication flow:
- Successful signup
- Successful login with JWT token storage
- User profile fetched and stored after login
- `getCurrentUser()` returns valid user object
- Dashboard displays proper user information

## Next Steps
- Test edge cases (token expiration, network failures)
- Add error handling for profile fetch failures
- Consider caching strategies for user data

## Reflection Note
The core issue was a mismatch between how authentication state was stored (JWT token only) versus how it was retrieved (expecting user data in localStorage). The solution unified both approaches with proper fallback mechanisms.

## Prompt Text
Context:
I have a Next.js frontend and a FastAPI backend.
Auth + Todos are handled by FastAPI using JWT.
Frontend stores access_token in localStorage and sends it to FastAPI.

Problem:
In my Next.js project, inside lib/auth.ts, getCurrentUser() always returns null.
However:
- Users are successfully signing up
- Users can log in
- JWT token is generated
- Todos are created and saved correctly in FastAPI
- Database has users and todos

So backend is working, but getCurrentUser is null on frontend.

Backend stack:
- FastAPI
- OAuth2PasswordBearer
- python-jose JWT
- SQLModel + Async SQLAlchemy
- Token payload uses "sub" = user.id (UUID)

Frontend:
- Next.js (App Router)
- TypeScript
- lib/auth.ts contains getCurrentUser()
- Token is stored in localStorage as "access_token"
- Requests are made with fetch

Your task:

1. Inspect lib/auth.ts and explain exactly why getCurrentUser() is returning null.
2. Verify Authorization header format (Bearer token).
3. Check JWT decode expectations vs frontend implementation.
4. Check exp handling and payload structure.
5. Ensure UUID handling is correct.
6. Compare frontend getCurrentUser with FastAPI get_current_user.
7. Provide exact fixed code for:
   - lib/auth.ts
   - frontend fetch helper (if needed)
8. Add minimal logging to confirm payload + token flow.
9. Do NOT change architecture (FastAPI must remain backend).
10. Do NOT introduce NextAuth / better-auth / new libraries.

Goal:
After your fix, getCurrentUser() must return the logged-in user consistently.

Be precise.
Give final corrected code, not theory.
Assume this is a production system.

Start by asking Claude Code to scan lib/auth.ts and all API calls related to auth.

## Response Text
Fixed the authentication flow by updating the getCurrentUser() function to properly decode JWT tokens and fetch user profile data from the backend API after login.