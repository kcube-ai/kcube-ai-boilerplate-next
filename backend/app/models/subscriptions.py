from typing import Optional
import datetime
import uuid

from sqlalchemy import CheckConstraint, DateTime, ForeignKeyConstraint, Index, PrimaryKeyConstraint, String, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models import Base


class Subscriptions(Base):
    __tablename__ = 'subscriptions'
    __table_args__ = (
        CheckConstraint(
            "plan::text = ANY (ARRAY['free'::character varying, 'standard'::character varying, 'premium'::character varying]::text[])", name='subscriptions_plan_check'),
        ForeignKeyConstraint(['user_id'], ['users.id'],
                             ondelete='CASCADE', name='subscriptions_user_id_fkey'),
        PrimaryKeyConstraint('id', name='subscriptions_pkey'),
        Index('idx_subscriptions_plan', 'plan'),
        Index('idx_subscriptions_stripe_id', 'stripe_subscription_id'),
        Index('idx_subscriptions_user_id', 'user_id')
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, server_default=text('gen_random_uuid()'))
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    plan: Mapped[str] = mapped_column(
        String(50), nullable=False, server_default=text("'free'::character varying"))
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(
        String(255), server_default=text("''::character varying"))
    plan_period_start: Mapped[Optional[datetime.datetime]
                              ] = mapped_column(DateTime(True))
    plan_period_end: Mapped[Optional[datetime.datetime]
                            ] = mapped_column(DateTime(True))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[Optional[datetime.datetime]] = mapped_column(
        DateTime(True), server_default=text('CURRENT_TIMESTAMP'))

    user: Mapped['Users'] = relationship(
        'Users', back_populates='subscriptions')
