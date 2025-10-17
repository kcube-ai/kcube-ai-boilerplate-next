from typing import Optional
import datetime
import uuid

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKeyConstraint, Index, Integer, PrimaryKeyConstraint, String, Text, UniqueConstraint, Uuid, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class SiteSettings(Base):
    __tablename__ = 'site_settings'
    __table_args__ = (
        PrimaryKeyConstraint('key', name='site_settings_pkey'),
    )

    key: Mapped[str] = mapped_column(Text, primary_key=True)
    value: Mapped[Optional[str]] = mapped_column(Text)
    json_value: Mapped[Optional[dict]] = mapped_column(JSONB)
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))
