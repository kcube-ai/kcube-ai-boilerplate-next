"""
Token generation and management utilities.
Provides secure token creation for authentication and verification.
"""

import secrets


class TokenManager:
    """Token generation and management."""

    def generate_signup_token(self) -> str:
        """Generate a 6-digit verification code for signup."""
        return str(secrets.randbelow(1000000)).zfill(6)

    def generate_password(self) -> str:
        """Generate a secure random password."""
        return secrets.token_urlsafe(16)

    def generate_password_reset_token(self) -> str:
        """Generate a secure token for password reset."""
        return secrets.token_urlsafe(16)


# Global instance
token_manager = TokenManager()
