"""
Base exception classes for application errors.
All module-specific exceptions should inherit from AppException.
"""


class AppException(Exception):
    """
    Base exception for all application errors.

    Attributes:
        message: Human-readable error message
        status_code: HTTP status code to return

    Usage:
        Create module-specific exceptions in backend/modules/{module}/exceptions.py
        that inherit from this base class.

    Example:
        class UserNotFound(AppException):
            MESSAGE = "User not found"

            def __init__(self, user_id: str | None = None):
                message = f"User with ID '{user_id}' not found" if user_id else self.MESSAGE
                super().__init__(message, status_code=404)
    """

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


# Common validation exceptions used across multiple modules
class InvalidEmailFormat(AppException):
    """Raised when email format is invalid."""

    MESSAGE = "Invalid email address format"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class InvalidPasswordFormat(AppException):
    """Raised when password doesn't meet requirements."""

    MESSAGE = "Password must be at least 8 characters long"

    def __init__(self, message: str | None = None):
        super().__init__(message or self.MESSAGE, status_code=400)


class InvalidValue(AppException):
    """Raised when a provided value is invalid."""

    MESSAGE = "Invalid value provided"

    def __init__(self, message: str | None = None):
        super().__init__(message or self.MESSAGE, status_code=400)
