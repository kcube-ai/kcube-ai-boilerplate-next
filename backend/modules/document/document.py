"""
Document management and processing utilities.
Includes functions for uploading, storing, and processing documents.
"""

from typing import List
from uuid import UUID

from fastapi import UploadFile

from backend.lib.file import file_service
from backend.models import Document
from backend.modules.knowledge.knowledge import knowledge_service

from .db import document_db
from .exceptions import DocumentNotFound, UnSupportedFileType


class DocumentService:
    """Service class for handling document operations."""

    async def create_all(
        self, session, files: List[UploadFile], user_id: UUID
    ) -> List[Document]:
        """Process multiple documents."""
        documents = []

        # Ensure all files are of supported types
        for file in files:
            if not file_service.is_supported(file.filename):
                raise UnSupportedFileType(file.filename.split(".")[-1])

        # Create document records
        for file in files:
            document = document_db.create(
                session, file.filename, f"{file.size} bytes", user_id
            )
            documents.append(document)

        return documents

    def get_all(self, session, user_id: UUID) -> List[Document]:
        """Get all documents by user ID."""
        return document_db.get_by_user_id(session, user_id)

    def delete(self, session, id: UUID, user_id: UUID) -> None:
        """Delete document by ID if it belongs to the user."""
        document = document_db.get(session, id)
        if not document or document.user_id != user_id:
            raise DocumentNotFound()

        # Delete associated knowledge
        knowledge_service.delete_by_source_id(session, id, user_id)

        # Delete
        document_db.delete(session, document)


document_service = DocumentService()
