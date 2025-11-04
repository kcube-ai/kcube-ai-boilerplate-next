"""
HTTP middleware components for request/response processing.
Includes logging, CORS, and other cross-cutting concerns.
"""

import logging

from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for request/response logging and timing."""

    async def dispatch(self, request: Request, call_next) -> Response:
        import time

        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        response.headers["X-Process-Time"] = f"{process_time:.4f}"

        # Log request
        status_emoji = "❌ " if response.status_code >= 400 else ""
        logger.info(
            f"{status_emoji}{request.method} {request.url.path} - "
            f"{response.status_code} - {process_time:.4f}s"
        )

        return response


def setup_middleware(app: FastAPI) -> None:
    """Setup all middleware for the FastAPI application."""
    app.add_middleware(RequestLoggingMiddleware)
