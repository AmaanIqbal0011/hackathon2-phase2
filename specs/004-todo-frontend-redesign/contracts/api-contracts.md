# API Contracts: Todo Frontend Redesign

## Overview
This document outlines the API contracts that the frontend redesign will utilize. The contracts remain unchanged as part of the requirement to preserve existing backend functionality.

## Authentication Endpoints
These endpoints are used for user authentication and session management.

### POST /auth/signup
- **Purpose**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string" (optional)
  }
  ```
- **Response**: 200 OK on success, redirects to signin page
- **Usage**: Used by signup page

### POST /auth/login
- **Purpose**: Authenticate user and return JWT token
- **Request Body**:
  ```json
  {
    "username": "string", // Actually email
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "string"
  }
  ```
- **Usage**: Used by signin page
- **Headers**: Content-Type: application/x-www-form-urlencoded

## Task Management Endpoints
These endpoints are used for CRUD operations on tasks.

### GET /api/todos
- **Purpose**: Retrieve all tasks for the authenticated user
- **Authorization**: Bearer token in Authorization header
- **Response**: Array of Todo objects
- **Usage**: Used by dashboard to load tasks

### POST /api/todos
- **Purpose**: Create a new task for the authenticated user
- **Authorization**: Bearer token in Authorization header
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string" (optional)
  }
  ```
- **Response**: Created Todo object
- **Usage**: Used by add task form

### PUT /api/todos/{id}
- **Purpose**: Update an existing task
- **Authorization**: Bearer token in Authorization header
- **Request Body**:
  ```json
  {
    "title": "string" (optional),
    "description": "string" (optional),
    "completed": "boolean" (optional)
  }
  ```
- **Response**: Updated Todo object
- **Usage**: Used for updating task status or details

### DELETE /api/todos/{id}
- **Purpose**: Delete a task
- **Authorization**: Bearer token in Authorization header
- **Response**: 204 No Content
- **Usage**: Used by task card delete button

## Data Models

### Todo Object
```json
{
  "id": "number",
  "title": "string",
  "description": "string | null",
  "completed": "boolean",
  "created_at": "string", // ISO date string
  "updated_at": "string"  // ISO date string
}
```

### User Object
```json
{
  "id": "string",
  "email": "string",
  "name": "string | null",
  "created_at": "string" // ISO date string
}
```

## Authentication Flow
1. User signs up or signs in via auth endpoints
2. JWT token is stored in localStorage
3. Token is attached to all subsequent API requests in Authorization header
4. Unauthorized requests redirect to signin page

## Error Handling
- Network errors are caught and displayed to user
- API errors return appropriate HTTP status codes
- Frontend displays user-friendly error messages