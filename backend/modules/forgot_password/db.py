"""
Database access layer for forgot password management.
Provides CRUD operations for forgot password entities in the database.
"""

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from backend.models import ForgotPassword


class ForgotPasswordDB:
    """Repository for forgot password database operations."""

    def create(
        self,
        session: Session,
        user_id: UUID,
        token: str,
        expires_at: datetime,
    ) -> ForgotPassword:
        """Create a new forgot password token entry."""
        forgot_password = ForgotPassword(
            user_id=user_id,
            token=token,
            expires_at=expires_at,
        )
        session.add(forgot_password)
        session.flush()
        return forgot_password

    def get_by_token_and_user_id(
        self,
        session: Session,
        token: str,
        user_id: UUID,
    ) -> Optional[ForgotPassword]:
        """Retrieve a forgot password entry by token and user ID."""
        stmt = select(ForgotPassword).where(
            ForgotPassword.token == token, ForgotPassword.user_id == user_id
        )
        result = session.execute(stmt).scalar_one_or_none()
        return result


forgot_password_db = ForgotPasswordDB()
