"""
Database utilities for document management.
Includes functions for initializing and managing the document database.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlmodel import Session

from backend.models import Document, DocumentStatus


class DocumentDB:
    """Class for managing document database operations."""

    def create(
        self, session: Session, filename: str, size: str, user_id: UUID
    ) -> Document:
        """Add new document to the database."""
        document = Document(
            user_id=user_id,
            name=filename,
            size=size,
        )
        session.add(document)
        session.flush()
        return document

    def get_by_user_id(self, session: Session, user_id: UUID) -> list[Document]:
        """Fetch all documents belonging to a specific user."""
        stmt = (
            select(Document)
            .where(Document.user_id == user_id)
            .order_by(Document.created_at.desc())
        )
        results = session.scalars(stmt).all()
        return results

    def get(self, session: Session, id: UUID) -> Document | None:
        """Get a document by ID"""
        stmt = select(Document).where(Document.id == id)
        document = session.scalar(stmt)
        return document

    def update_status(
        self, session: Session, document: Document, status: DocumentStatus
    ) -> Document:
        """Update status of document."""
        document.status = status
        document.updated_at = datetime.now()
        session.flush()
        return document

    def delete(self, session: Session, document: Document) -> None:
        """Delete a document."""
        session.delete(document)
        session.flush()


document_db = DocumentDB()
