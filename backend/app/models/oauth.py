from typing import Optional
import datetime
import uuid

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKeyConstraint, Index, Integer, PrimaryKeyConstraint, String, Text, UniqueConstraint, Uuid, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class OAuth(Base):
    __tablename__ = 'oauth'
    __table_args__ = (
        CheckConstraint(
            "provider::text = ANY (ARRAY['google'::character varying, 'meta'::character varying, 'microsoft'::character varying]::text[])", name='oauth_provider_check'),
        ForeignKeyConstraint(['user_id'], ['users.id'],
                             ondelete='CASCADE', name='oauth_user_id_fkey'),
        PrimaryKeyConstraint('id', name='oauth_pkey'),
        UniqueConstraint('provider', 'provider_user_id',
                         name='oauth_provider_provider_user_id_key'),
        Index('idx_oauth_provider', 'provider'),
        Index('idx_oauth_user_id', 'user_id')
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text('gen_random_uuid()'))
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    provider: Mapped[str] = mapped_column(String(30), nullable=False)
    provider_user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(320))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))

    user: Mapped['Users'] = relationship('Users', back_populates='oauth')
