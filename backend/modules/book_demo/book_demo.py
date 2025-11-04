"""
Service layer for book demo operations.
"""

from sqlmodel import Session

from backend.models import BookDemo

from .db import book_demo_db


class BookDemoService:
    """Service class for book demo business logic."""

    def create(
        self,
        session: Session,
        name: str,
        email: str,
        company_name: str,
        message: str | None = None,
    ) -> BookDemo:
        """
        Create a new book demo request.

        Args:
            session: Database session
            name: Full name of the person requesting demo
            email: Email address
            company_name: Company name
            message: Optional message from the requester

        Returns:
            Created BookDemo instance
        """
        return book_demo_db.create(
            session,
            name=name,
            email=email,
            company_name=company_name,
            message=message,
        )


# Global singleton instance
book_demo_service = BookDemoService()
