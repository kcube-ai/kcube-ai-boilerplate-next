"""
Rate limiting configuration and utilities.
Provides rate limiting for endpoints using fastapi-limiter with Redis.
"""

from typing import Optional

from fastapi import Request
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from redis import asyncio as aioredis

from backend.core.auth import get_user_id_from_token
from backend.core.config import settings
from backend.core.exceptions import AppException

# Global Redis client instance
redis_client: Optional[aioredis.Redis] = None


class RateLimitExceeded(AppException):
    """Exception raised when rate limit is exceeded."""

    MESSAGE = "Too many requests. Please try again later."

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=429)


async def get_identifier(request: Request) -> str:
    """
    Get identifier for rate limiting.

    Uses user ID if authenticated (from JWT token), otherwise falls back to IP address.
    This ensures authenticated users have per-user limits while unauthenticated
    requests are limited by IP.
    """
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            user_id = get_user_id_from_token(token)
            if user_id:
                return f"user:{user_id}"
        except Exception:
            pass

    # Fallback to IP address
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(
    times: int,
    seconds: int = 0,
    minutes: int = 0,
    hours: int = 0,
) -> RateLimiter:
    """
    Create a rate limiter dependency for endpoints.

    Args:
        times: Number of allowed requests
        seconds: Time window in seconds
        minutes: Time window in minutes
        hours: Time window in hours

    Returns:
        RateLimiter dependency
    """
    return RateLimiter(
        times=times,
        seconds=seconds,
        minutes=minutes,
        hours=hours,
        identifier=get_identifier,
    )


async def init_rate_limiter():
    """Initialize rate limiter with Redis connection."""
    global redis_client
    redis_client = await aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
    )
    await FastAPILimiter.init(redis_client)


async def close_rate_limiter():
    """Close rate limiter and Redis connection."""
    await FastAPILimiter.close()
