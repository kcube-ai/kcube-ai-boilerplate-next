"""
Forgot password module specific exceptions.
All exceptions related to password reset functionality.
"""

from backend.core.exceptions import AppException


class InvalidOrExpiredPasswordResetToken(AppException):
    """Raised when password reset token is invalid or expired."""

    MESSAGE = "Invalid or expired password reset token"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)
