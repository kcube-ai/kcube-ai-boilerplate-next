"""
Frontend routes for serving static files and HTML pages.
Handles all frontend-related routing including icons, logos, videos, images, and HTML pages.
"""

import os
import re

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

# Frontend directory path
frontend_dir = os.path.join(os.path.dirname(__file__), "frontend", "out")

# Create router
router = APIRouter()


# Serve root-level static files (icons, logos)
@router.get("/icon.png")
async def serve_icon():
    """Serve favicon icon."""
    return FileResponse(os.path.join(frontend_dir, "icon.png"))


@router.get("/apple-icon.png")
async def serve_apple_icon():
    """Serve Apple touch icon."""
    return FileResponse(os.path.join(frontend_dir, "apple-icon.png"))


@router.get("/favicon.ico")
async def serve_favicon_ico():
    """Serve favicon.ico."""
    file_path = os.path.join(frontend_dir, "favicon.ico")
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")


@router.get("/logo.png")
async def serve_logo_png():
    """Serve logo PNG."""
    return FileResponse(os.path.join(frontend_dir, "logo.png"))


@router.get("/logo.svg")
async def serve_logo_svg():
    """Serve logo SVG."""
    return FileResponse(os.path.join(frontend_dir, "logo.svg"))


@router.get("/video/{file_path:path}")
async def serve_video(file_path: str):
    """Serve video files from out/video directory."""
    video_path = os.path.join(frontend_dir, "video", file_path)

    # Security: ensure path stays within video directory
    if not os.path.abspath(video_path).startswith(
        os.path.join(os.path.abspath(frontend_dir), "video")
    ):
        raise HTTPException(status_code=404, detail="File not found")

    if os.path.isfile(video_path):
        return FileResponse(video_path)

    raise HTTPException(status_code=404, detail="File not found")


@router.get("/images/{file_path:path}")
async def serve_images(file_path: str):
    """Serve image files from out/images directory."""
    image_path = os.path.join(frontend_dir, "images", file_path)

    # Security: ensure path stays within images directory
    if not os.path.abspath(image_path).startswith(
        os.path.join(os.path.abspath(frontend_dir), "images")
    ):
        raise HTTPException(status_code=404, detail="File not found")

    if os.path.isfile(image_path):
        return FileResponse(image_path)

    raise HTTPException(status_code=404, detail="File not found")


@router.get("/{path:path}")
async def serve_frontend(path: str = ""):
    """
    Serve the frontend application with security and proper error handling.
    """
    # Sanitize path input to prevent traversal
    if path and not re.match(r"^[a-zA-Z0-9_-]+$", path):
        raise HTTPException(status_code=404, detail="Page not found")

    template_path = "index.html" if path == "" else f"{path}.html"
    full_path = os.path.join(frontend_dir, template_path)

    # Additional security: ensure path stays within frontend_dir
    if not os.path.abspath(full_path).startswith(os.path.abspath(frontend_dir)):
        raise HTTPException(status_code=404, detail="Page not found")

    if os.path.isfile(full_path):
        return FileResponse(full_path, media_type="text/html")

    # If file doesn't exist, serve 404
    notfound_path = os.path.join(
        os.path.dirname(__file__), "frontend", "public", "404.html"
    )
    if os.path.isfile(notfound_path):
        return FileResponse(notfound_path, media_type="text/html", status_code=404)

    # Final fallback
    raise HTTPException(status_code=404, detail="Page not found")
