"""Chat database operations."""

from typing import List
from uuid import UUID

from sqlalchemy import desc, select
from sqlmodel import Session

from backend.models import Chat


class ChatDB:
    """Repository class for chat database operations."""

    def create(self, session: Session, user_id: UUID, title: str) -> Chat:
        """Create a new chat."""
        chat = Chat(user_id=user_id, title=title)
        session.add(chat)
        session.flush()
        return chat

    def get(self, session: Session, chat_id: UUID) -> Chat | None:
        """Get a chat by ID."""
        stmt = select(Chat).where(Chat.id == chat_id)
        return session.scalar(stmt)

    def get_list(self, session: Session, user_id: UUID, limit: int = 50) -> List[Chat]:
        """Get list of chats for a user, ordered by most recent."""
        stmt = (
            select(Chat)
            .where(Chat.user_id == user_id)
            .order_by(desc(Chat.updated_at))
            .limit(limit)
        )
        return session.scalars(stmt).all()

    def delete(self, session: Session, chat: Chat) -> None:
        """Delete a chat."""
        session.delete(chat)
        session.flush()


chat_db = ChatDB()
