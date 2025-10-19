from typing import Optional
import datetime

from sqlalchemy import DateTime, PrimaryKeyConstraint, Text, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.models import Base


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
