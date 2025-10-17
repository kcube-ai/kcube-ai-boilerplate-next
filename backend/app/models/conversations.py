from typing import Optional
import datetime
import uuid

from sqlalchemy import DateTime, ForeignKeyConstraint, Index, PrimaryKeyConstraint, String, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models import Base


class Conversations(Base):
    __tablename__ = 'conversations'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'],
                             ondelete='CASCADE', name='conversations_user_id_fkey'),
        PrimaryKeyConstraint('id', name='conversations_pkey'),
        Index('idx_conversations_created_at', 'created_at'),
        Index('idx_conversations_user_id', 'user_id')
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text('gen_random_uuid()'))
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    title: Mapped[Optional[str]] = mapped_column(String(200))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))

    user: Mapped['Users'] = relationship(
        'Users', back_populates='conversations')
    chat_messages: Mapped[list['ChatMessages']] = relationship(
        'ChatMessages', back_populates='conversation')
