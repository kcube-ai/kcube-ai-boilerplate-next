"""
Logging configuration and setup for the application.
"""

import logging

from .config import settings


def setup_logging() -> None:
    """Setup basic logging configuration."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Log startup
    logger = logging.getLogger(__name__)
    logger.info(f"Logging configured for {settings.APP_NAME} v{settings.APP_VERSION}")
