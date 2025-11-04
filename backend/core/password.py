"""
Password hashing and verification using bcrypt.
Provides secure password management for user authentication.
"""

import bcrypt


class PasswordManager:
    """Password hashing and verification manager."""

    def get_hash(self, password: str) -> str:
        """Hash a password with bcrypt."""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed.decode("utf-8")

    def verify(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


# Global instance
password_manager = PasswordManager()
