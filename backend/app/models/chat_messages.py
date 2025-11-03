from typing import Optional
import datetime
import uuid

from sqlalchemy import CheckConstraint, DateTime, ForeignKeyConstraint, Index, Integer, PrimaryKeyConstraint, String, Text, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column, relationship, backref
from app.models import Base


class ChatMessages(Base):
    __tablename__ = 'chat_messages'
    __table_args__ = (
        CheckConstraint(
            "role::text = ANY (ARRAY['user'::character varying, 'assistant'::character varying]::text[])", name='chat_messages_role_check'),
        ForeignKeyConstraint(['conversation_id'], ['conversations.id'],
                             ondelete='CASCADE', name='chat_messages_conversation_id_fkey'),
        PrimaryKeyConstraint('id', name='chat_messages_pkey'),
        Index('idx_chat_messages_conversation_id', 'conversation_id'),
        Index('idx_chat_messages_created_at', 'created_at')
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text('gen_random_uuid()'))
    conversation_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    role: Mapped[str] = mapped_column(String(10), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    tokens_used: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default=text('0'))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))

    conversation: Mapped['Conversations'] = relationship(
        'Conversations', backref=backref("children", cascade="all,delete"))
