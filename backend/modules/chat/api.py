"""Chat API routes."""

from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Query
from pydantic import Field
from sqlmodel import SQLModel

from backend.api.deps import CurrentUserDep, SessionDep
from backend.models import Message as MessageResponse
from backend.modules.message.api import MessagePublic

from .chat import chat_service

router = APIRouter()


# Request/Response Models
class ChatCreate(SQLModel):
    """Request model for creating a chat."""

    title: str = Field(default="New Chat", min_length=1, max_length=500)


class ChatUpdate(SQLModel):
    """Request model for updating a chat."""

    title: str = Field(min_length=1, max_length=500)


class ChatPublic(SQLModel):
    """Public chat model for API responses."""

    id: UUID
    user_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime


class ChatWithMessages(ChatPublic):
    """Chat model with messages included."""

    messages: List[MessagePublic]


@router.post("/", response_model=ChatPublic)
def create(
    chat_in: ChatCreate,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Create a new chat."""
    chat = chat_service.create(session, user_id=current_user.id, title=chat_in.title)

    # Commit
    session.commit()

    return ChatPublic.model_validate(chat)


@router.get("/list", response_model=List[ChatPublic])
def get_list(
    session: SessionDep,
    current_user: CurrentUserDep,
    limit: int = Query(default=50, ge=1, le=100),
):
    """Get list of chats for the current user."""
    chats = chat_service.get_list(session, user_id=current_user.id, limit=limit)
    return [ChatPublic.model_validate(chat) for chat in chats]


@router.get("/{chat_id}", response_model=ChatWithMessages)
def get(
    chat_id: UUID,
    session: SessionDep,
    current_user: CurrentUserDep,
    max_messages: int = Query(default=100, ge=1, le=500),
):
    """Get a chat by ID with messages (sorted by created_at ascending)."""
    chat = chat_service.get(session, chat_id=chat_id, user_id=current_user.id)

    # Limit messages if necessary
    messages = (
        chat.messages[:max_messages]
        if len(chat.messages) > max_messages
        else chat.messages
    )

    chat_dict = ChatPublic.model_validate(chat).model_dump()
    chat_dict["messages"] = [MessagePublic.model_validate(msg) for msg in messages]

    return ChatWithMessages(**chat_dict)


@router.put("/{chat_id}", response_model=ChatPublic)
def update(
    chat_id: UUID,
    chat_in: ChatUpdate,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Update a chat title."""
    chat = chat_service.update(
        session, chat_id=chat_id, user_id=current_user.id, title=chat_in.title
    )

    # Commit
    session.commit()

    return ChatPublic.model_validate(chat)


@router.delete("/{chat_id}", response_model=MessageResponse)
def delete(
    chat_id: UUID,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """Delete a chat."""
    chat_service.delete(session, chat_id=chat_id, user_id=current_user.id)

    # Commit
    session.commit()

    return MessageResponse(message="Chat deleted successfully")
