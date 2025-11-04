"""
Background tasks for book demo operations.
Handles asynchronous operations like sending emails.
"""

import logging

from backend.core.config import settings

from .email import send_user_confirmation

logger = logging.getLogger(__name__)


def send_user_confirmation_task(
    demo_name: str, user_email: str, company_name: str
) -> None:
    """
    Background task to send user confirmation email.

    Args:
        demo_name: Name of the person requesting demo
        user_email: Email address to send confirmation to
        company_name: Company name from the demo request
    """
    if not settings.ENABLE_USER_EMAILS:
        logger.info(
            f"Email sending disabled. Skipping user confirmation for {user_email}"
        )
        return

    try:
        success = send_user_confirmation(demo_name, user_email, company_name)

        if success:
            logger.info(f"User confirmation sent successfully to {user_email}")
        else:
            logger.error(f"Failed to send user confirmation to {user_email}")

    except Exception as e:
        logger.error(f"Error sending user confirmation to {user_email}: {str(e)}")
