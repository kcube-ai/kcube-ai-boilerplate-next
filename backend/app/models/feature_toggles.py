from typing import Optional
import datetime
import uuid

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKeyConstraint, Index, Integer, PrimaryKeyConstraint, String, Text, UniqueConstraint, Uuid, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class FeatureToggles(Base):
    __tablename__ = 'feature_toggles'
    __table_args__ = (
        CheckConstraint(
            "plan::text = ANY (ARRAY['free'::character varying, 'standard'::character varying, 'premium'::character varying]::text[])", name='feature_toggles_plan_check'),
        PrimaryKeyConstraint('plan', 'feature_key',
                             name='feature_toggles_pkey'),
        Index('idx_feature_toggles_feature_key', 'feature_key'),
        Index('idx_feature_toggles_plan', 'plan')
    )

    plan: Mapped[str] = mapped_column(String(50), primary_key=True)
    feature_key: Mapped[str] = mapped_column(Text, primary_key=True)
    is_enabled: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text('false'))
