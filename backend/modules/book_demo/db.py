"""
Database operations for book demo module.
"""

from sqlmodel import Session

from backend.models import BookDemo


class BookDemoDB:
    """Repository for book demo database operations."""

    def create(self, session: Session, **kwargs) -> BookDemo:
        """Create a new book demo request."""
        demo = BookDemo(**kwargs)
        session.add(demo)
        session.flush()
        return demo


# Global singleton instance
book_demo_db = BookDemoDB()
