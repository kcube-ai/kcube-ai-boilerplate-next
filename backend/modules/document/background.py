"""
Run background jobs for document module.
Handling document processing.
"""

import logging
from uuid import UUID

from backend.core.database import get_db
from backend.lib.file import file_service
from backend.lib.text_chunker import text_chunk_service
from backend.models import DocumentStatus
from backend.modules.knowledge.knowledge import knowledge_service
from backend.services.openai import openai_service

from .db import document_db

logger = logging.getLogger(__name__)


def process_document(
    id: UUID, filename: str, mimetype: str, file_content: bytes
) -> None:
    """Extract text from the document and create knowledge chunks with embeddings."""
    db = get_db()
    session = next(db)

    # Get document
    document = document_db.get(session, id)
    if not document:
        logger.error(
            f"Document with ID {id} not found for processing in background job."
        )
        return

    # Mark as PROCESSING
    document_db.update_status(session, document, DocumentStatus.PROCESSING)
    session.commit()

    logger.info(f"Processing document {id}")
    try:
        # Extract content from file
        file_result = file_service.convert_to_markdown(
            file_content=file_content, mimetype=mimetype, filename=filename
        )
        if not file_result or not file_result.strip():
            logger.error(f"No text extracted from document {id}")
            raise ValueError("No text extracted from document")

        # Split into chunks (pass filename for intelligent chunking strategy)
        chunks = text_chunk_service.chunk_text(file_result)
        if not chunks:
            logger.error(f"No chunks generated for document {id}")
            raise ValueError("Failed to generate text chunks from document")

        # Process each chunk
        for idx, content in enumerate(chunks):
            embedding = openai_service.generate_embedding_large(content)
            meta_data = {"filename": filename}
            knowledge_service.create(
                session,
                source_id=id,
                content=content,
                meta_data=meta_data,
                chunk_number=idx + 1,
                embedding=embedding,
                user_id=document.user_id,
            )

        # Refresh document object and mark as INDEXED
        session.refresh(document)
        document_db.update_status(session, document, DocumentStatus.INDEXED)
        session.commit()
    except Exception as e:
        logger.error(f"Failed to process document {id}: {str(e)}")

        # Refresh document object and mark as FAILED
        session.refresh(document)
        document_db.update_status(session, document, DocumentStatus.FAILED)
        session.commit()
