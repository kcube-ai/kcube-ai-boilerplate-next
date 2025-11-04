"""
Dependency injection utilities for FastAPI endpoints.
Provides reusable dependencies like database sessions and authentication.
"""

from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from backend.core.auth import (
    get_current_admin,
    get_current_user,
    get_current_user_allow_unverified,
)
from backend.core.database import get_db
from backend.models import User

SessionDep = Annotated[Session, Depends(get_db)]

CurrentUserDep = Annotated[User, Depends(get_current_user)]
CurrentUserAllowUnverifiedDep = Annotated[
    User, Depends(get_current_user_allow_unverified)
]
CurrentAdminDep = Annotated[User, Depends(get_current_admin)]
