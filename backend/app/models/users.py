from typing import Optional
import datetime
import uuid

from sqlalchemy import CheckConstraint, DateTime, Index, PrimaryKeyConstraint, String, UniqueConstraint, Uuid, Boolean, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models import Base


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint(
            "role::text = ANY (ARRAY['user'::character varying, 'admin'::character varying]::text[])", name='users_role_check'),
        PrimaryKeyConstraint('id', name='users_pkey'),
        UniqueConstraint('email', name='users_email_key'),
        Index('idx_users_email', 'email'),
        Index('idx_users_role', 'role')
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text('gen_random_uuid()'))
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    bio: Mapped[str] = mapped_column(
        String(1200), nullable=False, server_default=text("''::character varying"))
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default=text("'user'::character varying"))
    is_verified: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text('false'))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))

    conversations: Mapped[list['Conversations']] = relationship(
        'Conversations', back_populates='user')
    oauth: Mapped[list['Oauth']] = relationship('Oauth', back_populates='user')
    subscriptions: Mapped[list['Subscriptions']] = relationship(
        'Subscriptions', back_populates='user')
