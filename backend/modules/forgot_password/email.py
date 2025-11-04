"""
Email helper functions for forgot password module.
Handles password reset email notifications.
"""

from datetime import datetime
from pathlib import Path

from backend.core.config import settings
from backend.core.email import email_service


def send_password_reset_email(
    email: str, name: str, token: str, user_id: str, app_public_url: str
) -> bool:
    """
    Send password reset email to a user.

    Args:
        email: User's email address
        name: User's full name
        token: Password reset token
        user_id: User's UUID
        app_public_url: Application public URL

    Returns:
        True if email was sent successfully
    """
    # Prepare template context
    context = {
        "name": name,
        "email": email,
        "app_public_url": app_public_url,
        "token": token,
        "reset_url": f"{app_public_url}/verify-forgot-password?token={token}&user_id={user_id}",
        "project_name": settings.APP_NAME,
        "current_year": datetime.now().year,
        "expiry_hours": settings.PASSWORD_RESET_TOKEN_EXPIRY_HOURS,
    }

    # Get template path
    template_path = Path(__file__).parent / "email_templates" / "password_reset.html"

    # Render template
    html_content = email_service.render_template(path=template_path, context=context)

    # Send email
    return email_service.send_email(
        subject=f"Reset your {settings.APP_NAME} password",
        html_content=html_content,
        to_emails=[email],
    )


def send_password_reset_success_email(
    email: str, name: str, app_public_url: str
) -> bool:
    """
    Send password reset success confirmation email to a user.

    Args:
        email: User's email address
        name: User's full name
        app_public_url: Application public URL

    Returns:
        True if email was sent successfully
    """
    # Prepare template context
    context = {
        "name": name,
        "email": email,
        "app_public_url": app_public_url,
        "project_name": settings.APP_NAME,
        "current_year": datetime.now().year,
    }

    # Get template path
    template_path = (
        Path(__file__).parent / "email_templates" / "password_reset_success.html"
    )

    # Render template
    html_content = email_service.render_template(path=template_path, context=context)

    # Send email
    return email_service.send_email(
        subject=f"Your {settings.APP_NAME} password has been reset",
        html_content=html_content,
        to_emails=[email],
    )
