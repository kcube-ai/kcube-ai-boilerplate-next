"""
This module provides utilities for generating and verifying time-based one-time passwords (TOTPs).
It is commonly used for implementing two-factor authentication (2FA) in applications.
"""

import pyotp

from backend.core.config import settings


class TOTPService:
    """Service for generating and verifying TOTP codes."""

    def generate_secret(self) -> str:
        """Generate a new base32 secret for TOTP."""
        return pyotp.random_base32()

    def verify(self, secret: str, token: str, valid_window: int = 1) -> bool:
        """Verify a TOTP token (accepts previous/current/next 30s window)."""
        totp = pyotp.TOTP(secret)
        return totp.verify(int(token), valid_window=valid_window)

    def generate_uri(self, secret: str, user_email: str) -> str:
        """Generate a provisioning URI for the TOTP."""
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(name=user_email, issuer_name=settings.APP_NAME)


totp_service = TOTPService()
