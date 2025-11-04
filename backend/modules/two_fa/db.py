"""
Database access layer for two-factor authentication (2FA).
Provides CRUD operations for 2FA entities in the database.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from backend.models import TwoFactorAuth


class TwoFactorAuthDB:
    """Repository for 2FA database operations."""

    def create(self, session: Session, user_id: UUID, secret: str) -> TwoFactorAuth:
        """Create a new 2FA entry for a user."""
        two_fa = TwoFactorAuth(user_id=user_id, totp_secret=secret)
        session.add(two_fa)
        session.flush()
        return two_fa

    def get_by_user_id(
        self, session: Session, user_id: UUID
    ) -> Optional[TwoFactorAuth]:
        """Retrieve 2FA settings for a user by their ID."""
        query = select(TwoFactorAuth).where(TwoFactorAuth.user_id == user_id)
        return session.exec(query).first()

    def update(
        self, session: Session, two_fa: TwoFactorAuth, two_fa_data: dict
    ) -> TwoFactorAuth:
        """Update existing 2FA object."""
        for key, value in two_fa_data.items():
            setattr(two_fa, key, value)
        two_fa.updated_at = datetime.now()
        session.flush()
        return two_fa


two_fa_db = TwoFactorAuthDB()
