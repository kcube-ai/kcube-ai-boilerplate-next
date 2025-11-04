"""
Environment variable loading utilities.
Provides robust environment variable retrieval with type conversion and validation.
"""

import os

from dotenv import load_dotenv

load_dotenv()


def _get_raw_env(key: str) -> str:
    """Get raw environment variable value. Single point for all env retrieval."""
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"Required environment variable '{key}' is not set")
    return value


def get_env(key: str) -> str:
    """Get required environment variable as string."""
    return _get_raw_env(key)


def get_env_bool(key: str) -> bool:
    """Get required environment variable as boolean-like (true/false/yes/no/1/0)."""
    val = _get_raw_env(key).lower()
    if val in {"true", "yes", "1"}:
        return True
    if val in {"false", "no", "0"}:
        return False
    raise ValueError(f"Environment variable '{key}' must be boolean-like, got: {val}")


def get_env_int(key: str) -> int:
    """Get required environment variable as integer with type conversion."""
    val = _get_raw_env(key)
    try:
        return int(val)
    except ValueError:
        raise ValueError(f"Environment variable '{key}' must be an integer, got: {val}")
