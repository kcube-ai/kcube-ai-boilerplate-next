"""
Email service for sending transactional emails via SendGrid.
Provides async email sending capabilities with template support.
"""

import ssl
from pathlib import Path
from typing import Dict, List

import urllib3
from jinja2 import Environment, FileSystemLoader
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from backend.core.config import settings


class EmailService:
    """Service for handling email operations using SendGrid."""

    def __init__(self):
        """Initialize the email service with SendGrid client."""
        self.api_key = settings.SENDGRID_API_KEY
        self.from_email = settings.SENDGRID_FROM_EMAIL
        self.from_name = settings.APP_NAME
        if not settings.SENDGRID_VERIFY_SSL:
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
            ssl._create_default_https_context = ssl._create_unverified_context

        self.client = SendGridAPIClient(self.api_key)

    def render_template(self, *, path: Path, context: Dict) -> str:
        """
        Render an HTML template with the given context.

        Args:
            path: Full path to the template file
            context: Dictionary of variables to pass to the template

        Returns:
            Rendered HTML string
        """
        template_dir = path.parent
        template_name = path.name

        env = Environment(loader=FileSystemLoader(str(template_dir)))
        template = env.get_template(template_name)

        return template.render(**context)

    def send_email(
        self,
        *,
        subject: str,
        html_content: str,
        to_emails: List[str],
    ) -> bool:
        """
        Send an email using SendGrid.

        Args:
            subject: Email subject
            html_content: HTML content of the email
            to_emails: List of recipient email addresses

        Returns:
            True if email was sent successfully, False otherwise
        """
        mail = Mail(
            subject=subject,
            to_emails=to_emails,
            html_content=html_content,
            from_email=(self.from_email, self.from_name),
        )

        resp = self.client.send(mail)

        return resp.status_code in [200, 201, 202]


# Singleton instance
email_service = EmailService()
