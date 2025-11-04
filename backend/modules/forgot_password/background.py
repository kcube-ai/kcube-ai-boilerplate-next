"""
Background tasks for forgot password module.
Handles asynchronous operations like sending emails.
"""

import logging

from backend.core.config import settings

from .email import send_password_reset_email, send_password_reset_success_email

logger = logging.getLogger(__name__)


def send_password_reset_email_task(
    email: str,
    name: str,
    token: str,
    user_id: str,
) -> None:
    """
    Background task to send password reset email.

    Args:
        email: User's email address
        name: User's full name
        token: 6-digit password reset token
        user_id: User's UUID
    """
    if not settings.ENABLE_USER_EMAILS:
        logger.info(
            f"Email sending disabled. Skipping password reset email for {email}"
        )
        return

    try:
        success = send_password_reset_email(
            email=email,
            name=name,
            token=token,
            user_id=user_id,
            app_public_url=settings.APP_PUBLIC_URL,
        )

        if success:
            logger.info(f"Password reset email sent successfully to {email}")
        else:
            logger.error(f"Failed to send password reset email to {email}")

    except Exception as e:
        logger.error(f"Error sending password reset email to {email}: {str(e)}")


def send_password_reset_success_email_task(email: str, name: str) -> None:
    """
    Background task to send password reset success confirmation email.

    Args:
        email: User's email address
        name: User's full name
    """
    if not settings.ENABLE_USER_EMAILS:
        logger.info(
            f"Email sending disabled. Skipping password reset success email for {email}"
        )
        return

    try:
        success = send_password_reset_success_email(
            email=email,
            name=name,
            app_public_url=settings.APP_PUBLIC_URL,
        )

        if success:
            logger.info(f"Password reset success email sent successfully to {email}")
        else:
            logger.error(f"Failed to send password reset success email to {email}")

    except Exception as e:
        logger.error(f"Error sending password reset success email to {email}: {str(e)}")
