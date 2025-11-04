# Exception Handling Architecture

This document explains the exception handling pattern used in the Sample AI backend.

## Overview

Instead of manually checking for errors in every endpoint with `if not result: raise HTTPException(...)`, we use a **centralized exception handling** approach:

1. **Define custom exceptions** in `backend/core/exceptions.py`
2. **Raise them in service layer** (business logic)
3. **Let FastAPI automatically handle them** via global exception handler
4. **No try-except boilerplate** in API endpoints

## Benefits

✅ **Clean API endpoints** - No error handling clutter
✅ **Consistent error responses** - All errors follow the same format
✅ **Type-safe** - Exceptions are well-defined classes
✅ **Centralized** - One place to update error handling
✅ **Self-documenting** - Exception names describe what went wrong

## How It Works

### 1. Custom Exception Classes

All exceptions inherit from `AppException` which includes HTTP status code:

```python
# backend/core/exceptions.py

class AppException(Exception):
    """Base exception with HTTP status code."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class EmailAlreadyExists(AppException):
    """Raised when email is already registered."""
    def __init__(self, email: str | None = None):
        message = f"Email address '{email}' is already registered" if email else "Email address is already registered"
        super().__init__(message, status_code=400)
```

### 2. Global Exception Handler

In `main.py`, we register a handler that converts exceptions to HTTP responses:

```python
from backend.core.exceptions import AppException

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Convert AppException to HTTP JSON response."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )
```

### 3. Raise Exceptions in Service Layer

Business logic raises exceptions when something goes wrong:

```python
# backend/modules/user/user.py

def create_user(self, session: Session, email: str, password: str, full_name: str) -> User:
    """Create a new user."""
    # Check if user already exists
    if user_db.exists_by_email(session, email):
        raise EmailAlreadyExists(email)  # 👈 Raise exception

    # Create user...
    return user
```

### 4. Clean API Endpoints

No need for try-except or manual error checking:

```python
# backend/modules/user/api.py

@router.post("/signup")
def signup(user_data: SignupRequest, session: SessionDep):
    """Sign up a new user."""
    # Just call service - exceptions are handled automatically!
    user = user_service.create_user(
        session,
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
    )

    return {"user_id": str(user.id)}
```

## Available Exceptions

### User Exceptions (Currently in Use)

| Exception                 | Status Code | Use Case                           |
| ------------------------- | ----------- | ---------------------------------- |
| `EmailAlreadyExists`      | 400         | Email is already registered        |
| `InvalidCredentials`      | 401         | Login email or password is wrong   |
| `UserNotFound`            | 404         | User doesn't exist                 |
| `UserAlreadyVerified`     | 400         | User tried to verify again         |
| `InvalidVerificationCode` | 400         | Verification code is wrong/expired |
| `InvalidPasswordChange`   | 400         | Old password is incorrect          |

## Creating New Exceptions

When you need a new exception:

### 1. Define it in `backend/core/exceptions.py`

```python
class InvalidDocumentFormat(AppException):
    """Raised when uploaded document has invalid format."""
    def __init__(self, allowed_formats: list[str]):
        formats = ", ".join(allowed_formats)
        super().__init__(
            f"Invalid document format. Allowed formats: {formats}",
            status_code=400
        )
```

### 2. Import and raise it in your service

```python
from backend.core.exceptions import InvalidDocumentFormat

class DocumentService:
    def upload_document(self, file: UploadFile):
        allowed_formats = ["pdf", "docx", "txt"]
        if file.extension not in allowed_formats:
            raise InvalidDocumentFormat(allowed_formats)
        # Process document...
```

### 3. That's it!

No changes needed in API layer - FastAPI automatically catches and handles it.

## Example: Login Flow

**Before (manual error handling):**

```python
@router.post("/login")
def login(data: LoginRequest, session: SessionDep):
    user = user_service.authenticate(session, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return UserPublic.model_validate(user)
```

**After (exception-based):**

```python
@router.post("/login")
def login(data: LoginRequest, session: SessionDep):
    """Login user. Raises InvalidCredentials if wrong email/password."""
    user = user_service.authenticate(session, data.email, data.password)
    return UserPublic.model_validate(user)
```

The service layer handles the error:

```python
def authenticate(self, session: Session, email: str, password: str) -> User:
    user = user_db.get_by_email(session, email)
    if not user or not self.verify_password(user, password):
        raise InvalidCredentials()  # 👈 Automatically becomes 401 response
    return user
```

## Error Response Format

All exceptions return consistent JSON:

```json
{
  "detail": "Email address 'test@example.com' is already registered"
}
```

Status code is set based on the exception's `status_code` attribute.

## When to Use Try-Except

You still need try-except for:

1. **External API calls** - Catch network errors, timeouts
2. **Database errors** - Catch SQLAlchemy exceptions
3. **Unknown errors** - Catch and convert to `InternalServerError`

Example:

```python
try:
    response = requests.post(external_api_url, json=data)
    response.raise_for_status()
except requests.RequestException as e:
    raise InternalServerError("Failed to communicate with external service")
```

## Best Practices

✅ **DO** raise exceptions in service layer
✅ **DO** create specific exception classes for different errors
✅ **DO** include helpful error messages
✅ **DO** document what exceptions your functions raise

❌ **DON'T** raise HTTPException directly in service layer
❌ **DON'T** return None to indicate errors (raise exception instead)
❌ **DON'T** catch AppException in API endpoints (let FastAPI handle it)
❌ **DON'T** use generic exceptions for specific errors

## Summary

This exception handling architecture keeps your code clean, consistent, and maintainable. Instead of scattering error handling throughout your codebase, you define exceptions once and raise them where errors occur. FastAPI does the rest automatically.
