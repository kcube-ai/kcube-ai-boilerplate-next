"""
Authentication utilities for JWT token validation and user retrieval.
Provides dependencies for FastAPI endpoints to authenticate requests.
"""

from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.database import get_db
from backend.models import User

# HTTP Bearer token scheme
security = HTTPBearer()


def create_access_token(user_id: UUID, pending_2fa: bool = False) -> str:
    """Create JWT access token for user."""
    expires_delta = timedelta(minutes=settings.JWT_EXPIRE_MINUTES_DELTA)
    expire = datetime.now() + expires_delta

    payload = {
        "sub": str(user_id),
        "exp": expire,
        "pending_2fa": pending_2fa,
    }

    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return token


def decode_token(token: str) -> dict:
    """Decode and validate JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_user_id_from_token(token: str) -> UUID:
    """Extract user ID from JWT token."""
    payload = decode_token(token)
    user_id_str: Optional[str] = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_pending_2fa_from_token(token: str) -> bool:
    """Extract pending_2fa status from JWT token."""
    payload = decode_token(token)
    return payload.get("pending_2fa", False)


def get_current_user_allow_unverified(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_db),
) -> User:
    """Get current authenticated user (verified or unverified) from JWT token."""
    token = credentials.credentials
    user_id = get_user_id_from_token(token)

    # Fetch user from database
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def get_current_user(
    user: User = Depends(get_current_user_allow_unverified),
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> User:
    """Get current authenticated and verified user from JWT token."""
    if not user.signup_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified",
        )

    # Check if 2FA verification is pending
    token = credentials.credentials
    pending_2fa = get_pending_2fa_from_token(token)

    if pending_2fa:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="2FA verification required",
        )

    return user


def get_current_admin(user: User = Depends(get_current_user)) -> User:
    """Get current authenticated, verified, and admin user from JWT token."""
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return user
