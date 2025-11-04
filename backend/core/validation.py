"""
Validation utilities for input data.
Provides reusable validators that return True/False.
"""

import base64
import re

# Email validation regex (RFC 5322 simplified)
EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

# Password requirements
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 100

# Full name requirements
MIN_WORDS_IN_NAME = 2
MIN_WORD_LENGTH = 2

# Signup token requirements
SIGNUP_TOKEN_LENGTH = 6

# TOTP token requirements
TOTP_TOKEN_LENGTH = 6

# Profile picture requirements
MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]


def is_valid_email(email: str) -> bool:
    """Check if email format is valid."""
    if not email:
        return False
    return bool(EMAIL_REGEX.match(email))


def is_valid_password(password: str, min_length: int = MIN_PASSWORD_LENGTH) -> bool:
    """Check if password meets security requirements."""
    if len(password) < min_length:
        return False
    return True


def is_valid_full_name(full_name: str) -> bool:
    """Check if full name has at least 2 words with minimum length."""
    trimmed = full_name.strip()
    if not trimmed:
        return False

    # Split into words and filter out empty strings
    words = [word for word in trimmed.split() if word]
    if len(words) < MIN_WORDS_IN_NAME:
        return False

    # Check each word meets minimum length
    for word in words:
        if len(word) < MIN_WORD_LENGTH:
            return False

    return True


def normalize_email(email: str) -> str:
    """Normalize email to lowercase and trimmed."""
    return email.lower().strip()


def normalize_full_name(full_name: str) -> str:
    """Normalize full name by trimming whitespace."""
    return full_name.strip()


def is_valid_signup_token(token: str) -> bool:
    """Check if signup token is valid 6-digit code."""
    if not token:
        return False
    return len(token) == SIGNUP_TOKEN_LENGTH and token.isdigit()


def is_valid_totp(token: str) -> bool:
    """Check if TOTP token is valid 6-digit code."""
    if not token:
        return False
    return len(token) == TOTP_TOKEN_LENGTH and token.isdigit()


def is_valid_profile_picture(data: str) -> bool:
    """Validate base64 profile picture data."""
    if not data or not isinstance(data, str):
        return False

    # Check if it's a data URI (data:image/...;base64,...)
    if not data.startswith("data:image/"):
        return False

    # Extract mime type and base64 data
    try:
        header, base64_data = data.split(",", 1)
    except ValueError:
        return False

    # Validate mime type
    mime_type = header.split(";")[0].replace("data:", "")
    if mime_type not in ALLOWED_IMAGE_TYPES:
        return False

    # Validate base64 encoding
    try:
        decoded = base64.b64decode(base64_data, validate=True)
    except Exception:
        return False

    # Check size (decoded)
    if len(decoded) > MAX_PROFILE_PICTURE_SIZE:
        return False

    return True
