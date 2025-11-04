"""
Forgot password service layer for business logic implementation.
Handles forgot password token creation, validation, and expiration.
"""

from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from sqlmodel import Session

from backend.core.config import settings
from backend.core.token import token_manager
from backend.models import ForgotPassword

from .db import forgot_password_db
from .exceptions import InvalidOrExpiredPasswordResetToken


class ForgotPasswordService:
    """Service class for forgot password business logic."""

    def create(self, session: Session, user_id: UUID) -> ForgotPassword:
        """Create a forgot password token for the given user ID."""
        token = token_manager.generate_password_reset_token()
        expires_at = datetime.now() + timedelta(
            hours=settings.PASSWORD_RESET_TOKEN_EXPIRY_HOURS
        )

        forgot_password = forgot_password_db.create(session, user_id, token, expires_at)

        return forgot_password

    def verify(self, session: Session, token: str, user_id: UUID) -> ForgotPassword:
        """Verify a password reset token and mark it as used."""
        forgot_password = forgot_password_db.get_by_token_and_user_id(
            session, token, user_id
        )
        if (
            not forgot_password
            or forgot_password.expires_at < datetime.now()
            or forgot_password.used_at is not None
        ):
            raise InvalidOrExpiredPasswordResetToken()

        # Mark token as used
        forgot_password.used_at = datetime.now()
        session.add(forgot_password)
        session.flush()

        return forgot_password


forgot_password_service = ForgotPasswordService()
