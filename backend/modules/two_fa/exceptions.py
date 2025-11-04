"""
Exceptions for the two_fa module.
"""

from backend.core.exceptions import AppException


class TwoFANotFound(AppException):
    """Raised when 2FA settings cannot be found for a user."""

    MESSAGE = "2FA not found"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=404)


class InvalidTotpCode(AppException):
    """Raised when a TOTP code is invalid."""

    MESSAGE = "Invalid code"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)
