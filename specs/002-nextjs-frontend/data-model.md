# Data Model: Next.js Frontend

**Date**: 2026-01-08

## Entities

### User
*Represents the authenticated user.*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `email` | string | Yes | User's email address |
| `name` | string | Yes | Display name |
| `createdAt` | string | Yes | ISO 8601 timestamp |

### Task
*Represents a todo item managed by the user.*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `userId` | string | Yes | ID of the owner |
| `title` | string | Yes | Task title |
| `description` | string | No | Optional details |
| `completed` | boolean | Yes | Completion status |
| `createdAt` | string | Yes | ISO 8601 timestamp |
| `updatedAt` | string | Yes | ISO 8601 timestamp |

### AuthToken
*Represents the session token.*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accessToken` | string | Yes | JWT for API access |
| `expiresIn` | number | Yes | Seconds until expiry |
| `tokenType` | string | Yes | Usually "Bearer" |

## State Management

### Auth State
*Managed via Better Auth / Context*
- `user`: User | null
- `isLoading`: boolean
- `error`: Error | null

### Task List State
*Managed via React Query or Local State + Services*
- `tasks`: Task[]
- `filter`: 'all' | 'completed' | 'pending'
