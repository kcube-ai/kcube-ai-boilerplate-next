"""
Main FastAPI application entry point.
Configures the application with middleware, routing, and static file serving.
"""

import os
import time
from contextlib import asynccontextmanager

# Set timezone to UTC
os.environ["TZ"] = "UTC"
if hasattr(time, "tzset"):
    time.tzset()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.core.config import settings
from backend.core.exceptions import AppException
from backend.core.logging import setup_logging
from backend.core.middleware import setup_middleware
from backend.core.rate_limit import close_rate_limiter, init_rate_limiter
from backend.modules.registry import get_api_router
from frontend_routes import router as frontend_router

# Setup logging first
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    await init_rate_limiter()
    yield
    await close_rate_limiter()


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=True,
    lifespan=lifespan,
)


# Global exception handler for custom application exceptions
@app.exception_handler(AppException)
async def app_exception_handler(req: Request, exc: AppException):
    """
    Handle custom application exceptions and convert to HTTP responses.

    This provides a centralized way to handle all business logic exceptions
    without needing try-except blocks in every endpoint.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )


# Setup middleware
setup_middleware(app)

# Include API router
api_router = get_api_router()
app.include_router(api_router, prefix=settings.API_PREFIX)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.cors_methods_list,
    allow_headers=(
        [settings.CORS_ALLOW_HEADERS]
        if settings.CORS_ALLOW_HEADERS == "*"
        else settings.CORS_ALLOW_HEADERS
    ),
)


# Serve frontend static files
frontend_dir = os.path.join(os.path.dirname(__file__), "frontend", "out")

# Mount frontend static assets
app.mount(
    "/_next",
    StaticFiles(directory=os.path.join(frontend_dir, "_next")),
    name="static_next",
)

# Include frontend router (icons, logos, videos, images, HTML pages)
app.include_router(frontend_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
