"""
Health check module for application monitoring.
Provides liveness and readiness endpoints for service health.
"""

from .api import router

__all__ = ["router"]
