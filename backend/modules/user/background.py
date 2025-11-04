"""
Background tasks for user-related operations.
Handles asynchronous operations like sending emails.
"""

import logging

from backend.core.config import settings

from .email import send_verification_email, send_welcome_email

logger = logging.getLogger(__name__)


def send_verification_email_task(
    email: str,
    name: str,
    token: str,
) -> None:
    """
    Background task to send verification email.

    Args:
        email: User's email address
        name: User's full name
        token: 6-digit verification code
    """
    if not settings.ENABLE_USER_EMAILS:
        logger.info(f"Email sending disabled. Skipping verification email for {email}")
        return

    try:
        success = send_verification_email(
            email=email,
            name=name,
            token=token,
            app_public_url=settings.APP_PUBLIC_URL,
        )

        if success:
            logger.info(f"Verification email sent successfully to {email}")
        else:
            logger.error(f"Failed to send verification email to {email}")

    except Exception as e:
        logger.error(f"Error sending verification email to {email}: {str(e)}")


def send_welcome_email_task(email: str, name: str) -> None:
    """
    Background task to send welcome email.

    Args:
        email: User's email address
        name: User's full name
    """
    if not settings.ENABLE_USER_EMAILS:
        logger.info(f"Email sending disabled. Skipping welcome email for {email}")
        return

    try:
        success = send_welcome_email(
            email=email,
            name=name,
            app_public_url=settings.APP_PUBLIC_URL,
        )

        if success:
            logger.info(f"Welcome email sent successfully to {email}")
        else:
            logger.error(f"Failed to send welcome email to {email}")

    except Exception as e:
        logger.error(f"Error sending welcome email to {email}: {str(e)}")
