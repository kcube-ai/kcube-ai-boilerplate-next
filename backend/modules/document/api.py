"""
Document API routes.
Handles document upload, retrieval, and management.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, File, UploadFile
from pydantic import BaseModel

from backend.api.deps import CurrentUserDep, SessionDep
from backend.core.config import settings
from backend.models import Document as DocumentModel

from .background import process_document
from .document import document_service
from .exceptions import MaxDocumentsExceeded

router = APIRouter()


class Message(BaseModel):
    """Simple message response."""

    message: str


class Documents(BaseModel):
    documents: List[DocumentModel]


@router.post("/", response_model=Message)
async def upload(
    current_user: CurrentUserDep,
    session: SessionDep,
    background_task: BackgroundTasks,
    files: List[UploadFile] = File(...),
):
    """Upload and process documents."""
    # Check if user would exceed document limit
    current_doc_count = len(current_user.documents)
    if current_doc_count + len(files) > settings.MAX_DOCUMENTS_PER_USER:
        raise MaxDocumentsExceeded(settings.MAX_DOCUMENTS_PER_USER)

    documents = await document_service.create_all(
        session, files, user_id=current_user.id
    )

    # Commit
    session.commit()

    # Schedule background processing for each document
    document_map = {doc.name: doc for doc in documents}
    for file in files:
        file_bytes = await file.read()
        document = document_map.get(file.filename)

        background_task.add_task(
            process_document, document.id, file.filename, file.content_type, file_bytes
        )

    return Message(message="Documents uploaded successfully.")


@router.get("/all", response_model=Documents)
def get_all(current_user: CurrentUserDep, session: SessionDep):
    """Get list of user's documents."""
    documents = document_service.get_all(session, current_user.id)

    return Documents(documents=documents)


@router.delete("/", response_model=Message)
def delete(current_user: CurrentUserDep, id: UUID, session: SessionDep):
    """Delete a document if it belongs to the user."""
    document_service.delete(session, id, current_user.id)

    # Commit
    session.commit()

    return Message(message="Document deleted successfully")
