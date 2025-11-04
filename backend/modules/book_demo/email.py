"""
Email functionality for book demo module.
"""

from datetime import datetime
from pathlib import Path

from backend.core.config import settings
from backend.core.email import email_service


def send_user_confirmation(demo_name: str, user_email: str, company_name: str) -> bool:
    """
    Send confirmation email to user who requested demo.

    Args:
        demo_name: Name of the person requesting demo
        user_email: Email address to send confirmation to
        company_name: Company name from the demo request

    Returns:
        True if email was sent successfully
    """
    context = {
        "name": demo_name,
        "email": user_email,
        "company_name": company_name,
        "project_name": settings.APP_NAME,
        "current_year": datetime.now().year,
    }

    # Get template path
    template_path = Path(__file__).parent / "email_templates" / "user_confirmation.html"

    # Render template
    html_content = email_service.render_template(path=template_path, context=context)

    # Send email
    return email_service.send_email(
        subject=f"Demo Request Received - {settings.APP_NAME}",
        html_content=html_content,
        to_emails=[user_email],
    )
