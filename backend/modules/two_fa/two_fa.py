"""
Two-factor authentication (2FA) service layer for business logic.
Handles 2FA setup, verification, and management operations.
"""

from datetime import datetime
from uuid import UUID

from sqlmodel import Session

from backend.lib.totp import totp_service

from .db import two_fa_db
from .exceptions import InvalidTotpCode, TwoFANotFound


class TwoFactorAuthService:
    """Service for managing 2FA operations."""

    def get_qr_url(self, session: Session, user_id: UUID, email: str) -> str:
        """Get QR code URL for 2FA setup."""
        two_fa = two_fa_db.get_by_user_id(session, user_id)
        if not two_fa:
            raise TwoFANotFound()

        url = totp_service.generate_uri(two_fa.totp_secret, email)
        return url

    def verify(self, session: Session, user_id: UUID, totp: str) -> None:
        """Verify a 2FA token and enable 2FA for user."""
        two_fa = two_fa_db.get_by_user_id(session, user_id)
        if not two_fa:
            raise TwoFANotFound()

        # Verify the token
        if not totp_service.verify(two_fa.totp_secret, totp):
            raise InvalidTotpCode()

        # Enable 2FA
        two_fa_db.update(
            session,
            two_fa,
            {"is_enabled": True, "verified_at": datetime.now()},
        )

    def verify_code(self, session: Session, user_id: UUID, totp: str) -> bool:
        """Verify a 2FA code for a user (for login)."""
        two_fa = two_fa_db.get_by_user_id(session, user_id)
        if not two_fa:
            raise TwoFANotFound()

        # Verify the user-provided token
        if not totp_service.verify(two_fa.totp_secret, totp):
            raise InvalidTotpCode()
        return True

    def create(self, session: Session, user_id: UUID) -> None:
        """Create 2FA settings for a user with generated secret."""
        secret = totp_service.generate_secret()
        two_fa_db.create(session, user_id=user_id, secret=secret)

    def disable(self, session: Session, user_id: UUID) -> None:
        """Disable 2FA for a user."""
        two_fa = two_fa_db.get_by_user_id(session, user_id)
        if not two_fa:
            raise TwoFANotFound()

        two_fa_db.update(session, two_fa, {"is_enabled": False})


two_fa_service = TwoFactorAuthService()
