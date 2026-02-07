from contextlib import asynccontextmanager
import os
import sys
import asyncio
from typing import AsyncGenerator, Optional
from datetime import datetime, timedelta
from uuid import UUID, uuid4


from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from sqlmodel import SQLModel, Field, select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt


# -------------------------
# Windows Async Fix
# -------------------------
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# -------------------------
# ENV
# -------------------------
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

# Convert to async PostgreSQL
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://"
    )

# -------------------------
# Database
# -------------------------
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async_session = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    async with async_session() as session:
        yield session


# -------------------------
# Security
# -------------------------
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -------------------------
# Models
# -------------------------
class User(SQLModel, table=True):
    __tablename__ = "users"  # FIXED (not reserved keyword)

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    email: str
    password: str
    name: Optional[str] = None


class UserResponse(SQLModel):
    id: UUID
    email: str
    name: Optional[str]
    created_at: datetime


class Token(SQLModel):
    access_token: str
    token_type: str


class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TodoCreate(SQLModel):
    title: str
    description: Optional[str] = None


class TodoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(SQLModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime


# -------------------------
# Auth Utils
# -------------------------
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_session)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_exception
        user_uuid = UUID(user_id)
    except (JWTError, ValueError):
        raise credentials_exception

    result = await session.execute(
        select(User).where(User.id == user_uuid)
    )
    user = result.scalars().first()
    if not user:
        raise credentials_exception

    return user


# -------------------------
# DB Init
# -------------------------
async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


# -------------------------
# App
# -------------------------
app = FastAPI(
    title="Todo API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Errors
# -------------------------
@app.exception_handler(HTTPException)
async def http_error(_, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def global_error(_, exc: Exception):
    print(exc)
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})


# -------------------------
# Routes
# -------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/auth/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user



# ---------- AUTH ----------
@app.post("/auth/signup", response_model=UserResponse, status_code=201)
async def signup(
    user_in: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(User).where(User.email == user_in.email)
    )
    if result.scalars().first():
        raise HTTPException(400, "Email already registered")

    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        name=user_in.name
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@app.post("/auth/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(User).where(User.email == form_data.username)
    )
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")

    token = create_access_token(
        {"sub": str(user.id)},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": token, "token_type": "bearer"}


# ---------- TODOS ----------
@app.post("/api/todos", response_model=TodoResponse, status_code=201)
async def create_todo(
    todo_in: TodoCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    todo = Todo(
        title=todo_in.title,
        description=todo_in.description,
        user_id=user.id
    )
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


@app.get("/api/todos", response_model=list[TodoResponse])
async def list_todos(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Todo).where(Todo.user_id == user.id)
    )
    return result.scalars().all()


@app.put("/api/todos/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: int,
    todo_in: TodoUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == user.id)
    )
    todo = result.scalars().first()
    if not todo:
        raise HTTPException(404, "Todo not found")

    for field, value in todo_in.model_dump(exclude_unset=True).items():
        setattr(todo, field, value)

    todo.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}", status_code=204)
async def delete_todo(
    todo_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == user.id)
    )
    todo = result.scalars().first()
    if not todo:
        raise HTTPException(404, "Todo not found")

    await session.delete(todo)
    await session.commit()