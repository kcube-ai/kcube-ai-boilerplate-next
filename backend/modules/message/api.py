"""Message API routes."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter
from pydantic import Field
from sqlmodel import SQLModel

from backend.api.deps import CurrentUserDep, SessionDep
from backend.models import MessageRole
from backend.modules.chat import chat_service
from backend.modules.message import message_service

router = APIRouter()


# Request/Response Models
class MessageCreate(SQLModel):
    """Request model for creating a message."""

    chat_id: UUID | None = None
    content: str = Field(min_length=1, max_length=5000)


class MessagePublic(SQLModel):
    """Public message model for API responses."""

    id: UUID
    chat_id: UUID
    role: str
    content: str
    meta_data: dict | None
    created_at: datetime
    updated_at: datetime


# API Endpoints
@router.post("/", response_model=MessagePublic)
def post_message(
    message_in: MessageCreate,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Post a message to a chat and get AI response."""
    # Get or create chat
    if message_in.chat_id:
        chat = chat_service.get(
            session, chat_id=message_in.chat_id, user_id=current_user.id
        )
    else:
        title = (
            message_in.content[:100] + "..."
            if len(message_in.content) > 100
            else message_in.content
        )
        chat = chat_service.create(session, user_id=current_user.id, title=title)

    # Create user message
    message_service.create(
        session=session,
        chat_id=chat.id,
        content=message_in.content,
        role=MessageRole.USER,
    )

    # Create placeholder assistant message
    ai_message = message_service.create(
        session=session,
        chat_id=chat.id,
        content="Processing message...",
        role=MessageRole.ASSISTANT,
    )

    # Generate AI response with RAG and history
    message_service.get_answer(
        session=session,
        chat=chat,
        ai_message=ai_message,
        user_message=message_in.content,
        user_id=current_user.id,
    )

    # Update chat timestamp
    chat_service.update_details(session, chat)

    # Commit all changes
    session.commit()

    return MessagePublic.model_validate(ai_message)
