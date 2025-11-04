"""
Health check API endpoints for system monitoring.
Provides detailed system metrics and application status information.
"""

import os
import platform
import time
from datetime import datetime

import psutil
from fastapi import APIRouter, Depends

from backend.core.auth import get_current_admin
from backend.core.config import settings

router = APIRouter()


def format_uptime(uptime_seconds: float) -> str:
    """Format uptime in HH:MM:SS format."""
    hours = int(uptime_seconds // 3600)
    minutes = int((uptime_seconds % 3600) // 60)
    seconds = int(uptime_seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


@router.get("/health", dependencies=[Depends(get_current_admin)])
async def check():
    """Comprehensive health check endpoint with detailed system information."""
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    process = psutil.Process()
    uptime_seconds = time.time() - process.create_time()
    cpu_percent = psutil.cpu_percent(interval=0.1)

    # Check Redis connectivity
    from backend.core.rate_limit import (
        redis_client,  # Importing here to get initialized client
    )

    redis_status = "healthy"
    redis_error = None
    overall_status = "healthy"

    try:
        if redis_client:
            await redis_client.ping()
        else:
            redis_status = "unhealthy"
            redis_error = "Redis client not initialized"
            overall_status = "degraded"
    except Exception as e:
        redis_status = "unhealthy"
        redis_error = str(e)
        overall_status = "degraded"

    return {
        "status": overall_status,
        "message": f"{settings.APP_NAME} API is running",
        "version": settings.APP_VERSION,
        "timestamp": datetime.now().isoformat(),
        "uptime_seconds": uptime_seconds,
        "uptime_human": format_uptime(uptime_seconds),
        "services": {
            "redis": {
                "status": redis_status,
                "error": redis_error,
            },
        },
        "system": {
            "python_version": platform.python_version(),
            "platform": platform.platform(),
            "architecture": platform.architecture()[0],
            "processor": platform.processor() or "Unknown",
            "hostname": platform.node(),
            "cpu_count": psutil.cpu_count(),
            "cpu_percent": cpu_percent,
        },
        "memory": {
            "total_mb": round(memory.total / 1024 / 1024, 2),
            "available_mb": round(memory.available / 1024 / 1024, 2),
            "used_mb": round(memory.used / 1024 / 1024, 2),
            "percent_used": memory.percent,
        },
        "disk": {
            "total_gb": round(disk.total / 1024 / 1024 / 1024, 2),
            "free_gb": round(disk.free / 1024 / 1024 / 1024, 2),
            "used_gb": round(disk.used / 1024 / 1024 / 1024, 2),
            "percent_used": round((disk.used / disk.total) * 100, 2),
        },
        "process": {
            "pid": os.getpid(),
            "memory_mb": round(process.memory_info().rss / 1024 / 1024, 2),
            "cpu_percent": process.cpu_percent(),
            "threads": process.num_threads(),
            "create_time": datetime.fromtimestamp(process.create_time()).isoformat(),
        },
        "application": {
            "api_prefix": settings.API_PREFIX,
            "cors_origins_count": len(settings.cors_origins_list),
            "cors_origins": settings.cors_origins_list,
        },
    }
