# Quickstart: Todo Backend API

## Prerequisites
- Python 3.11+
- UV Package Manager
- Neon PostgreSQL connection string (or local Postgres)

## Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Initialize Environment**:
   ```bash
   # If not already initialized
   uv init
   ```

3. **Install Dependencies**:
   ```bash
   uv add fastapi uvicorn sqlmodel psycopg[binary] python-jose[cryptography] python-dotenv passlib[bcrypt]
   # Note: passlib needed for password hashing
   ```

4. **Environment Variables**:
   Create `.env` in `/backend`:
   ```env
   DATABASE_URL=postgresql://user:pass@host/db
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

## Running the Server

Start the development server:

```bash
uv run uvicorn main:app --reload
```

Server will be running at `http://localhost:8000`.
Docs available at `http://localhost:8000/docs`.

## Testing

Run tests with pytest:

```bash
uv run pytest
```
