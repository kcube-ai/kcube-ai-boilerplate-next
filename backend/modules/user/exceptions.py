"""
User module specific exceptions.
All exceptions related to user management, authentication, and validation.
"""

from backend.core.exceptions import AppException


class EmailAlreadyExists(AppException):
    """Raised when attempting to register with an existing email."""

    MESSAGE = "Email address is already registered"

    def __init__(self, email: str | None = None):
        message = (
            f"Email address '{email}' is already registered" if email else self.MESSAGE
        )
        super().__init__(message, status_code=400)


class InvalidCredentials(AppException):
    """Raised when login credentials are incorrect."""

    MESSAGE = "Invalid email or password"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=401)


class UserNotFound(AppException):
    """Raised when a user cannot be found."""

    MESSAGE = "User not found"

    def __init__(self, user_id: str | None = None):
        message = f"User with ID '{user_id}' not found" if user_id else self.MESSAGE
        super().__init__(message, status_code=404)


class UserAlreadyVerified(AppException):
    """Raised when attempting to verify an already verified user."""

    MESSAGE = "User account is already verified"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class InvalidVerificationCode(AppException):
    """Raised when verification code is invalid or expired."""

    MESSAGE = "Invalid or expired verification code. Please request a new one."

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class PasswordAlreadyExists(AppException):
    """Raised when password already exists for a user during set password."""

    MESSAGE = "Password is already set."

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class InvalidSignupToken(AppException):
    """Raised when signup token format is invalid."""

    MESSAGE = "Verification code must be a 6-digit number"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class InvalidPasswordChange(AppException):
    """Raised when password change fails (wrong old password)."""

    MESSAGE = "Current password is incorrect"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class InvalidFullName(AppException):
    """Raised when full name is invalid."""

    MESSAGE = "Full name must contain at least 2 words with minimum 2 characters each"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class InvalidProfilePicture(AppException):
    """Raised when profile picture data is invalid."""

    MESSAGE = "Invalid profile picture. Must be a valid image (JPEG, PNG, GIF, WebP) under 5MB"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)


class InvalidGoogleToken(AppException):
    """Raised when Google OAuth token is invalid."""

    MESSAGE = "Invalid Google OAuth token"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)
