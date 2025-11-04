"""Message database operations."""

from typing import Dict
from uuid import UUID

from sqlmodel import Session

from backend.models import Message, MessageRole


class MessageDB:
    """Repository class for message database operations."""

    def create(
        self,
        session: Session,
        chat_id: UUID,
        role: MessageRole,
        content: str,
        meta_data: Dict | None = None,
    ) -> Message:
        """Create a new message."""
        message = Message(
            chat_id=chat_id, role=role, content=content, meta_data=meta_data
        )
        session.add(message)
        session.flush()
        return message


message_db = MessageDB()
