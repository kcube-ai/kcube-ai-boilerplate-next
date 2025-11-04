"""
Email helper functions for user-related emails.
Handles verification and welcome emails.
"""

from datetime import datetime
from pathlib import Path

from backend.core.config import settings
from backend.core.email import email_service


def send_verification_email(
    email: str, name: str, token: str, app_public_url: str
) -> bool:
    """
    Send email verification code to a new user.

    Args:
        email: User's email address
        name: User's full name
        token: 6-digit verification code
        app_public_url: Application public URL

    Returns:
        True if email was sent successfully
    """
    # Prepare template context
    context = {
        "name": name,
        "email": email,
        "app_public_url": app_public_url,
        "verification_code": token,
        "project_name": settings.APP_NAME,
        "current_year": datetime.now().year,
    }

    # Get template path
    template_path = Path(__file__).parent / "email_templates" / "signup_verify.html"

    # Render template
    html_content = email_service.render_template(path=template_path, context=context)

    # Send email
    return email_service.send_email(
        subject=f"Verify your {settings.APP_NAME} account",
        html_content=html_content,
        to_emails=[email],
    )


def send_welcome_email(email: str, name: str, app_public_url: str) -> bool:
    """
    Send welcome email to a new user.

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
    template_path = Path(__file__).parent / "email_templates" / "welcome.html"

    # Render template
    html_content = email_service.render_template(path=template_path, context=context)

    # Send email
    return email_service.send_email(
        subject=f"Welcome to {settings.APP_NAME}!",
        html_content=html_content,
        to_emails=[email],
    )
