"""Chat service layer for business logic."""

from datetime import datetime
from typing import List
from uuid import UUID

from sqlmodel import Session

from backend.models import Chat

from .db import chat_db
from .exceptions import ChatNotFound


class ChatService:
    """Service class for chat business logic."""

    def create(self, session: Session, user_id: UUID, title: str) -> Chat:
        """Create a new chat."""
        return chat_db.create(session, user_id=user_id, title=title)

    def get(self, session: Session, chat_id: UUID, user_id: UUID) -> Chat:
        """Get a chat by ID with access control."""
        chat = chat_db.get(session, chat_id)
        if not chat or chat.user_id != user_id:
            raise ChatNotFound(chat_id)
        return chat

    def get_list(self, session: Session, user_id: UUID, limit: int = 50) -> List[Chat]:
        """Get list of chats for a user."""
        return chat_db.get_list(session, user_id, limit)

    def update(
        self, session: Session, chat_id: UUID, user_id: UUID, title: str
    ) -> Chat:
        """Update a chat title with access control."""
        chat = self.get(session, chat_id, user_id)
        chat.title = title
        chat.updated_at = datetime.now()
        session.add(chat)
        session.flush()
        return chat

    def delete(self, session: Session, chat_id: UUID, user_id: UUID) -> None:
        """Delete a chat with access control."""
        chat = self.get(session, chat_id, user_id)
        chat_db.delete(session, chat)

    def update_details(
        self, session: Session, chat: Chat, title: str | None = None
    ) -> None:
        """Update chat metadata (title and updated_at timestamp)."""
        if title:
            chat.title = title
        chat.updated_at = datetime.now()
        session.add(chat)
        session.flush()


chat_service = ChatService()
