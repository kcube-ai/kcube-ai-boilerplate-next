# Sample AI - Complete Architecture & Development Guide

## Project Overview

**Sample AI** is a full-stack web application combining:

- **Backend**: FastAPI (Python) with modular architecture, SQLModel ORM, PostgreSQL
- **Frontend**: Next.js 15 with TypeScript, React 19, Tailwind CSS, shadcn/ui
- **Infrastructure**: Docker, Redis (rate limiting), SendGrid (emails)

**Tech Stack**:

- Python 3.11 + FastAPI 0.115
- TypeScript + React 19 + Next.js 15
- PostgreSQL 13+ + SQLModel
- Redis (rate limiting)
- Pydantic 2 + SQLAlchemy 2
- JWT authentication + 2FA support
- SendGrid for emails

---

## Quick Start Commands

### Backend Setup

```bash
# Activate virtual environment (uses venv/ at project root)
source venv/bin/activate

# Install dependencies
./venv/bin/pip install -r requirements.txt

# Start Redis (required for rate limiting)
docker run -d --name redis -p 6379:6379 redis:alpine

# Run database migrations
alembic upgrade head

# Start backend dev server
./venv/bin/python -m uvicorn main:app --reload

# Backend runs on http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Frontend Setup

```bash
# Install frontend dependencies
cd frontend && pnpm install

# Run frontend dev server
pnpm dev
# Frontend runs on http://localhost:3000

# Build frontend for production
pnpm build

# Generate OpenAPI client from backend schema
pnpm generate-client

# Lint frontend code
pnpm lint
```

### Code Quality & Formatting

```bash
# Format ALL Python code (MUST run after EVERY change)
./venv/bin/isort backend/ --profile black
./venv/bin/black backend/

# Lint frontend code
cd frontend && pnpm lint
```

### Database Migrations

```bash
# Create new migration from model changes
alembic revision --autogenerate -m "Description of changes"

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

### Testing

```bash
# Run Python tests
./venv/bin/pytest

# Run with coverage
./venv/bin/pytest --cov=backend

# Run specific test file
./venv/bin/pytest tests/test_user.py
```

### Docker Deployment

```bash
# Build Docker image
docker build -t sample-ai:latest .

# Run Docker container
docker run -d -p 8000:8000 \
  -e POSTGRES_SERVER=db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=sample_db \
  -e REDIS_URL=redis://redis:6379/0 \
  sample-ai:latest

# Docker compose (if available)
docker-compose up
```

### Verification Commands

```bash
# Check backend config loads correctly
./venv/bin/python -c "from backend.core.config import settings; print('✓ Config OK')"

# Check database connection
./venv/bin/python -c "from backend.core.database import engine; print('✓ DB OK')"

# Stop Redis
docker stop redis && docker rm redis

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true
```

---

## Directory Structure

```
sample-ai/
├── backend/                    # FastAPI application
│   ├── core/                   # Core utilities
│   │   ├── config.py           # Settings (environment variables)
│   │   ├── env.py              # Environment variable getters
│   │   ├── database.py         # Database connection & session
│   │   ├── exceptions.py       # Base AppException class
│   │   ├── auth.py             # JWT token creation/verification
│   │   ├── password.py         # Password hashing utilities
│   │   ├── token.py            # Token generation
│   │   ├── rate_limit.py       # Rate limiting with Redis
│   │   ├── email.py            # SendGrid email service
│   │   ├── logging.py          # Centralized logging
│   │   ├── middleware.py       # Custom middleware setup
│   │   └── validation.py       # Input validation utilities
│   ├── api/
│   │   └── deps.py             # Dependency injection (SessionDep, CurrentUserDep, etc)
│   ├── models.py               # SQLModel database tables
│   ├── modules/                # Feature modules
│   │   ├── registry.py         # Module registration system
│   │   ├── user/               # User management module
│   │   │   ├── api.py          # FastAPI endpoints
│   │   │   ├── user.py         # Service layer (business logic)
│   │   │   ├── db.py           # Database operations (CRUD)
│   │   │   ├── exceptions.py   # User module exceptions
│   │   │   ├── lib.py          # Utility functions
│   │   │   ├── background.py   # Background tasks (email sending)
│   │   │   ├── email.py        # Email template rendering
│   │   │   └── email_templates/# HTML email templates
│   │   ├── two_fa/             # Two-factor authentication module
│   │   ├── forgot_password/    # Password reset module
│   │   ├── book_demo/          # Demo booking module
│   │   ├── health/             # Health check endpoints
│   │   └── document/           # Document management module
│   └── alembic/                # Database migrations
├── frontend/                   # Next.js 15 application
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout with auth routing
│   │   ├── init.ts             # App initialization
│   │   ├── client/             # Auto-generated OpenAPI client
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── verify-signup/      # Email verification page
│   │   ├── dashboard/          # Dashboard page (auth required)
│   │   └── settings/           # Settings page (auth required)
│   ├── components/             # React components
│   │   ├── auth/               # Auth-specific components
│   │   │   ├── auth-layout.tsx # Centered auth layout
│   │   │   ├── auth-card.tsx   # Form container
│   │   │   ├── auth-input.tsx  # Input with validation
│   │   │   ├── auth-button.tsx # Submit button with loading
│   │   │   └── code-input.tsx  # 6-digit OTP input
│   │   └── ui/                 # shadcn/ui components
│   ├── config/                 # Configuration & constants
│   │   ├── app.ts              # App name, version, etc
│   │   └── api.ts              # OpenAPI client initialization
│   ├── constants/              # Design tokens & constants
│   │   └── ui.ts               # Colors, sizes, typography
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # Authentication helpers
│   │   ├── token.ts            # Token management (auto-syncs API)
│   │   ├── error.ts            # Error handling
│   │   ├── format.ts           # Data formatting
│   │   ├── validation.ts       # Form validation
│   │   └── utils.ts            # General utilities
│   ├── contexts/               # React Context
│   │   └── user-context.tsx    # User state management
│   ├── hooks/                  # Custom React hooks
│   ├── DESIGN_SYSTEM.md        # Complete design system documentation
│   ├── STRUCTURE.md            # Frontend structure guide
│   └── package.json            # npm dependencies
├── main.py                     # FastAPI app entry point
├── alembic.ini                 # Database migration config
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker build configuration
├── .env.example                # Environment template
├── CLAUDE.md                   # This file
├── ARCHITECTURE.md             # Detailed backend architecture
└── README.md                   # Project README
```

---

## Architecture Overview

### Backend Layered Architecture

**One session per request, one commit per request**

```
┌─────────────────────────────────────┐
│ API Layer (api.py)                  │ ← HTTP requests/responses
│ - Route handlers                    │ ← Validation, orchestration
│ - Session commit (ONE per endpoint) │ ← session.commit() only here
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Service Layer (user.py, etc)        │ ← Business logic
│ - Business rules                    │ ← Exception handling
│ - Query once, modify object         │ ← session.flush() only
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ DB Layer (db.py)                    │ ← CRUD operations
│ - Repository pattern                │ ← session.add()/flush()
│ - No business logic                 │ ← Never commit
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Model Layer (models.py)             │ ← SQLModel tables
│ - ORM definitions                   │
└─────────────────────────────────────┘
```

### Module System

Each module follows this structure:

- **api.py** - FastAPI endpoints, request/response models, validation
- **user.py** (service) - Business logic, exceptions, session.flush()
- **db.py** - Repository pattern, CRUD operations, session.flush()
- **exceptions.py** - Module-specific exceptions
- **lib.py** - Utility functions (optional)
- **background.py** - Background tasks like email (optional)
- **email.py** - Email template rendering (optional)

Modules are registered in `backend/modules/registry.py` with:

- Name
- Router (lazy-loaded)
- URL prefix
- Tags (for OpenAPI docs)

### Authentication & Authorization

**Dependencies** (from `backend/api/deps.py`):

- `SessionDep` - Database session
- `CurrentUserDep` - Verified user only
- `CurrentUserAllowUnverifiedDep` - Verified OR unverified users
- `CurrentAdminDep` - Admin users only

**Flow**:

1. User signs up → Email with 6-digit code
2. User verifies email → Signup complete
3. User logs in → JWT token (with optional pending_2fa flag)
4. 2FA verification (if enabled) → Removes pending_2fa flag
5. Token used for all authenticated requests

### Rate Limiting

Uses **fastapi-limiter** with Redis backend:

```python
@router.post("/signup", dependencies=[Depends(rate_limit(2, hours=24))])
def signup(...):
    # 2 attempts per 24 hours
```

**Identifier Strategy**:

- **Authenticated**: Limited by user ID (from JWT token)
- **Unauthenticated**: Limited by IP address (respects X-Forwarded-For)

**Configuration** in `.env`:

```bash
REDIS_URL=redis://localhost:6379/0  # Local dev
REDIS_URL=redis://host:6380/0?ssl=True  # Azure production
```

---

## Frontend Architecture

### Design System (CRITICAL)

**Location**: `/frontend/DESIGN_SYSTEM.md`

**Key Principles**:

- Use constants from `/frontend/constants/ui.ts`
- Colors: `sample-blue` and `sample-gray` palettes only
- Sections: `py-16 lg:py-20` for padding
- No hardcoded colors or arbitrary values
- Dark/light mode support via CSS variables

### File Organization Rules

**lib/** - Pure functions by PURPOSE (no React):

- `auth.ts` - Authentication helpers
- `token.ts` - Token management (auto-syncs with OpenAPI.TOKEN)
- `error.ts` - Error handling & API responses
- `format.ts` - Date/text formatting
- `validation.ts` - Input validation
- `utils.ts` - General utilities (cn for Tailwind classes)

**hooks/** - Custom React hooks only

**components/** - React components only

- `auth/` - Authentication components
- `ui/` - shadcn/ui components

**config/** - Application configuration

- `app.ts` - App name, version, URLs
- `api.ts` - OpenAPI client setup

**contexts/** - React Context for state

### Token Management

**Auto-syncs with OpenAPI client**:

```typescript
// lib/token.ts
saveToken(token); // Stores + updates OpenAPI.TOKEN
clearToken(); // Removes + clears OpenAPI.TOKEN
getToken(); // Returns current token

// Automatically used in:
// - API requests (OpenAPI client)
// - localStorage
// - All HTTP headers
```

### Error Handling

**Centralized in lib/error.ts**:

```typescript
import { handleError } from "@/lib/error";

try {
  await UsersService.login({ requestBody: { email, password } });
} catch (error) {
  handleError(error); // Handles automatically:
  // - 401/403: Clear token + redirect to /login
  // - 429: Show rate limit message
  // - Other: Show API error message
}
```

### Authentication Routes

In `app/layout.tsx`:

- **Guest routes** (`/login`, `/signup`) → Redirect to dashboard if logged in
- **Authenticated routes** (`/dashboard`, `/settings`) → Require login
- **Public routes** → Accessible to all

---

## Documentation Maintenance (CRITICAL)

**IMPORTANT: Always keep documentation synchronized with code changes!**

When making ANY architectural, structural, or significant feature changes, you MUST update the relevant documentation files to reflect the current state of the codebase.

### Documentation Files to Maintain

1. **ARCHITECTURE.md** - Update when changing:

   - Layered architecture patterns (API/Service/DB/Model layers)
   - Session management approach
   - Exception handling patterns
   - Module system structure
   - Rate limiting implementation
   - Authentication/authorization flow
   - Naming conventions
   - Any core architectural decisions

2. **CLAUDE.md** (this file) - Update when changing:

   - Commands for build, lint, test, deploy
   - Directory structure
   - Module organization
   - Development workflow
   - Environment variables
   - Critical rules and patterns
   - Dependencies (requirements.txt, package.json)

3. **README.md** - Update when changing:

   - Features list
   - Tech stack
   - Quick start instructions
   - Installation steps
   - Essential environment variables
   - Deployment process

4. **frontend/DESIGN_SYSTEM.md** - Update when changing:
   - Color palettes
   - Component patterns
   - Typography system
   - Spacing/layout conventions
   - Design tokens

### When to Update Documentation

✅ **ALWAYS update immediately after:**

- Adding/removing a module
- Changing layered architecture patterns
- Modifying session management rules
- Adding/removing dependencies
- Changing environment variables
- Updating authentication flow
- Adding new architectural patterns
- Changing naming conventions
- Modifying exception handling
- Updating build/deploy process

### Documentation Update Checklist

When making code changes, ask yourself:

- [ ] Does this change affect the layered architecture? → Update ARCHITECTURE.md
- [ ] Does this add/remove a module or feature? → Update CLAUDE.md + README.md
- [ ] Does this change commands or workflows? → Update CLAUDE.md
- [ ] Does this modify environment variables? → Update CLAUDE.md + README.md
- [ ] Does this affect the frontend design system? → Update frontend/DESIGN_SYSTEM.md
- [ ] Does this change the tech stack? → Update README.md

### Documentation Quality Standards

- ✅ Keep examples current with actual code
- ✅ Include real file paths and line references where applicable
- ✅ Update diagrams when architecture changes
- ✅ Remove outdated sections immediately
- ✅ Verify all commands still work
- ✅ Cross-reference related sections

**Remember: Outdated documentation is worse than no documentation. Keep it accurate and current!**

---

## Critical Rules & Best Practices

### Python Code Standards

1. **Docstrings (MANDATORY)** - Every module needs one:

   ```python
   """
   Brief description.
   Extended description with more context.
   """
   ```

2. **Format Code (AFTER EVERY CHANGE)**:

   ```bash
   ./venv/bin/isort backend/ --profile black
   ./venv/bin/black backend/
   ```

3. **Import Order**:

   ```python
   # Standard library
   import os
   from datetime import datetime

   # Third-party
   from fastapi import APIRouter

   # Local
   from backend.core.config import settings
   ```

### Session Management (CRITICAL)

**Golden Rule: One session per request, one commit per request**

| Layer       | Allowed                            | NOT Allowed           |
| ----------- | ---------------------------------- | --------------------- |
| **DB**      | `session.add()`, `session.flush()` | ❌ `session.commit()` |
| **Service** | `session.flush()`                  | ❌ `session.commit()` |
| **API**     | `session.commit()` (once at END)   | ❌ Multiple commits   |

Example:

```python
# DB Layer - NEVER commit
def create(self, session: Session, **kwargs) -> User:
    user = User(**kwargs)
    session.add(user)
    session.flush()  # ✓
    return user

# Service Layer - NEVER commit
def create_user(self, session: Session, email: str) -> User:
    user = user_db.create(session, email=email)
    session.flush()  # ✓
    return user

# API Layer - ONLY place for commit
@router.post("/signup")
def signup(data: SignupRequest, session: SessionDep):
    user = user_service.create_user(session, data.email)
    session.commit()  # ✓ Only here, at the END
    return UserPublic.model_validate(user)
```

### Exception Handling

**Flow**: Service raises → API layer lets bubble up → Global handler catches

```python
# Module exceptions (backend/modules/{module}/exceptions.py)
class UserNotFound(AppException):
    MESSAGE = "User not found"
    def __init__(self, user_id: str | None = None):
        message = f"User with ID '{user_id}' not found" if user_id else self.MESSAGE
        super().__init__(message, status_code=404)

# Service layer - raise exceptions
def get(self, session: Session, user_id: UUID) -> User:
    user = user_db.get_by_id(session, user_id)
    if not user:
        raise UserNotFound(str(user_id))  # ✓
    return user

# API layer - NO try-except needed
@router.get("/{user_id}")
def get_user(user_id: UUID, session: SessionDep):
    user = user_service.get(session, user_id)  # Exception bubbles up
    return UserPublic.model_validate(user)

# Global handler (main.py)
@app.exception_handler(AppException)
async def app_exception_handler(req: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )
```

### Timezone Configuration

**System timezone is UTC** (set in `main.py`):

```python
# ✓ CORRECT
created_at = datetime.now()  # Returns UTC automatically

# ❌ WRONG
created_at = datetime.now(timezone.utc)  # Redundant
```

### Naming Conventions

**Repository/Service Methods** - No resource prefix in class:

```python
# ✓ CORRECT
class UserService:
    def get(self, session: Session, user_id: UUID) -> User: ...
    def create(self, session: Session, **kwargs) -> User: ...
    def update(self, session: Session, user_id: UUID, **kwargs) -> User: ...
    def authenticate(self, session: Session, email: str, password: str) -> User: ...

# ❌ WRONG
class UserService:
    def get_user(self, ...) -> User: ...  # Redundant
    def create_user(self, ...) -> User: ...  # Redundant
```

**API Endpoints** - Simple action names:

```python
# ✓ CORRECT
@router.post("/signup")
def signup(data: SignupRequest): ...  # UsersService.signup()

@router.post("/login")
def login(data: LoginRequest): ...  # UsersService.login()

# ❌ WRONG
@router.post("/signup")
def user_signup_endpoint(data: SignupRequest): ...  # Redundant!
```

**Response Models** - NO "Response" suffix:

```python
# ✓ CORRECT
class Auth(BaseModel):
    access_token: str
    user: UserPublic

@router.post("/login", response_model=Auth)  # Clear from response_model
def login(data: LoginRequest):
    return Auth(access_token=token, user=user)

# ❌ WRONG
class AuthResponse(BaseModel):  # Redundant suffix
    access_token: str
    user: UserPublic
```

### Environment Variables

**All variables REQUIRED** (no defaults) via `backend/core/env.py`:

```bash
# Application
APP_NAME=Sample AI
APP_VERSION=1.0.0
APP_PUBLIC_URL=http://localhost:3000
ENABLE_USER_EMAILS=true

# API
API_PREFIX=/api/v1

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
CORS_ALLOW_HEADERS=*
CORS_ALLOW_CREDENTIALS=true

# JWT
JWT_ALGORITHM=HS256
JWT_SECRET_KEY=your-secret-key
JWT_EXPIRE_MINUTES_DELTA=43200

# SendGrid
SENDGRID_API_KEY=your-api-key
SENDGRID_FROM_EMAIL=noreply@example.com
SENDGRID_VERIFY_SSL=true

# PostgreSQL
POSTGRES_DB=sample_db
POSTGRES_USER=postgres
POSTGRES_PORT=5432
POSTGRES_SERVER=localhost
POSTGRES_PASSWORD=your-password

# Redis (required for rate limiting)
REDIS_URL=redis://localhost:6379/0
```

---

## Git Workflow

### Branch Naming

```
feature/user-authentication
fix/signup-validation
refactor/database-layer
docs/api-documentation
```

### Commit Workflow

```bash
# Check status and changes
git status
git diff

# Format code (required)
./venv/bin/isort backend/ --profile black
./venv/bin/black backend/

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add user authentication with JWT tokens"

# Push to remote
git push origin feature/user-authentication
```

### Commit Message Guidelines

**CRITICAL: Commit messages should be clean and professional**

❌ **NEVER include:**

- References to Claude, Claude Code, or AI assistance
- "Co-Authored-By: Claude" or similar attribution
- Emojis (like 🤖) unless explicitly part of project style
- Links to Claude.com or Anthropic

**Examples:**

❌ Bad:

```
Add Xero OAuth integration

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Pre-commit Checklist

- [ ] Run `isort` + `black` on all Python changes
- [ ] Run `pnpm lint` on frontend changes
- [ ] Update relevant documentation
- [ ] All tests passing (`pytest`)
- [ ] No hardcoded values (use environment variables)
- [ ] Following naming conventions
- [ ] Commit message is clean (no AI references)

---

## Development Workflow

### Adding a New Feature

1. **Create module structure**:

   ```bash
   mkdir backend/modules/my_feature
   touch backend/modules/my_feature/{__init__.py,api.py,db.py,my_feature.py,exceptions.py}
   ```

2. **Define models** (in `backend/models.py`):

   ```python
   class MyModel(SQLModel, table=True):
       id: UUID = Field(default_factory=uuid4, primary_key=True)
       # ... fields
   ```

3. **Create migration**:

   ```bash
   alembic revision --autogenerate -m "Add my_feature table"
   alembic upgrade head
   ```

4. **Implement DB layer** (`db.py`):

   - Simple CRUD operations
   - Only `session.flush()`, never `session.commit()`
   - Return types: object or None

5. **Implement Service layer** (`my_feature.py`):

   - Business logic
   - Exception handling
   - Only `session.flush()`, never `session.commit()`

6. **Implement API layer** (`api.py`):

   - FastAPI endpoints
   - Request/response models
   - Single `session.commit()` at END

7. **Register module** (`backend/modules/registry.py`):

   ```python
   ModuleConfig(
       name="my_feature",
       router=lambda: __import__("backend.modules.my_feature.api", fromlist=["router"]).router,
       prefix="/my-feature",
       tags=["My Feature"],
   ),
   ```

8. **Format and test**:
   ```bash
   ./venv/bin/isort backend/ --profile black
   ./venv/bin/black backend/
   pytest
   ```

### Debugging

```python
# Python debugging
import pdb; pdb.set_trace()

# SQL logging (in config)
SQLALCHEMY_ECHO = True

# Check logs
# Automatic via middleware with timing: "45.23ms"
```

---

## API Documentation

**Auto-generated from FastAPI**:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

**Generate frontend client**:

```bash
cd frontend
pnpm generate-client
# Creates: app/client/ with TypeScript types
```

---

## Deployment

### Docker Deployment

**Build image**:

```bash
docker build -t sample-ai:latest .
```

**Run container**:

```bash
docker run -d -p 8000:8000 \
  -e POSTGRES_SERVER=db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=sample_db \
  -e REDIS_URL=redis://redis:6379/0 \
  sample-ai:latest
```

**Environment variables** (required):

- All from `.env.example`
- REDIS_URL must be configured
- JWT_SECRET_KEY must be strong
- SENDGRID_API_KEY for emails

### Azure Deployment

1. Create App Service
2. Configure Application Settings with all `.env` variables
3. Create Azure Cache for Redis (Basic tier ~$16/month)
4. Set REDIS_URL in App Service config
5. Deploy via Docker or git push

---

## Dependencies

### Backend (`requirements.txt`)

```
FastAPI 0.115.13
Uvicorn 0.34.2
SQLModel 0.0.24
SQLAlchemy 2.0.40
Psycopg 3.2.6 (PostgreSQL driver)
Pydantic 2.11.7
PyJWT 2.10.1 (JWT tokens)
bcrypt 4.3.0 (password hashing)
python-dotenv 1.1.1 (environment variables)
fastapi-limiter 0.1.6 (rate limiting)
redis 5.2.1 (rate limiting store)
SendGrid 6.11.0 (email service)
Alembic 1.15.2 (database migrations)
Black 25.9.0 (code formatting)
isort 6.0.1 (import sorting)
Jinja2 3.1.6 (email templates)
pyotp 2.9.0 (2FA TOTP)
```

### Frontend (`package.json`)

```
Next.js 15.2.4 (React framework)
React 19 (UI library)
TypeScript 5 (type safety)
Tailwind CSS 3.4 (styling)
shadcn/ui (component library)
@radix-ui/* (accessible components)
Zod 3.24 (validation)
React Hook Form 7.55 (form management)
Axios 1.8.4 (HTTP client)
date-fns (date utilities)
Lucide React (icons)
@tanstack/react-query (data fetching)
@hey-api/openapi-ts (API client generation)
```

---

## Never Touch

These directories are legacy or deprecated:

- `data-engineering/` - Legacy Azure Functions
- `web-app/` - Deprecated Django application
- `testing/` - Old test infrastructure

---

## Performance Tips

### Database

- Use eager loading for relationships:
  ```python
  from sqlalchemy.orm import selectinload
  statement = select(User).options(selectinload(User.organizations))
  ```
- Paginate large result sets
- Index frequently queried columns

### Rate Limiting

- Use Redis for distributed rate limiting
- Adjust limits based on security vs usability
- Monitor rate limit violations

### Frontend

- Use React Query for caching
- Lazy load components with dynamic imports
- Minimize bundle size (check with `next build`)
- Use Next.js Image component for optimization

---

## Troubleshooting

### Backend issues

**Config errors**:

```bash
./venv/bin/python -c "from backend.core.config import settings; print('OK')"
```

**Database errors**:

```bash
# Check connection
./venv/bin/python -c "from backend.core.database import get_db; print('OK')"

# Rollback migration
alembic downgrade -1
```

**Redis errors**:

```bash
# Check Redis is running
docker ps | grep redis

# Restart Redis
docker stop redis && docker rm redis
docker run -d --name redis -p 6379:6379 redis:alpine
```

### Frontend issues

**Client not generated**:

```bash
cd frontend
pnpm generate-client
```

**Node modules corrupted**:

```bash
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Docker issues

**Container exits**:

```bash
docker logs container_id
```

**Port already in use**:

```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 process_id
```

---

## Important Notes

### Security

- Never commit `.env` file to git
- Use strong `JWT_SECRET_KEY` (random string)
- All environment variables are REQUIRED (fail fast)
- Rate limiting prevents brute force attacks
- Password hashing uses bcrypt
- 2FA adds extra security layer
- CORS restricted to specified origins

### Code Quality

- Always run `isort` + `black` after changes
- Follow layered architecture strictly
- Keep services composable
- Use exceptions for business logic errors
- Write docstrings on all modules
- No hardcoded values (use constants or env vars)

### Database

- Always use migrations for schema changes
- Use type hints in models
- Create indexes for frequently queried columns
- Test migrations before deploying

### Performance

- Use connection pooling (SQLAlchemy default)
- Implement caching where appropriate
- Paginate large result sets
- Use Redis for session/cache storage

---

## Version Info

- Python: 3.11
- Node.js: 18.x (recommended)
- PostgreSQL: 13+
- Redis: Alpine
- Docker: Latest

---

**Last Updated**: 2025-10-17
**Source**: Comprehensive codebase analysis

This is the central documentation for all Sample AI development.
Maintain these standards for consistency, maintainability, and scalability.
