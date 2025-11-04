"""Rename avatar_url to profile_picture and remove length constraint

Revision ID: 4e9bb3ad94c2
Revises: 1e3047189639
Create Date: 2025-10-16 19:32:37.419689

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "4e9bb3ad94c2"
down_revision: Union[str, None] = "1e3047189639"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Rename column and remove length constraint
    op.alter_column(
        "user",
        "avatar_url",
        new_column_name="profile_picture",
        type_=sa.Text(),
        nullable=True,
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Reverse: rename back and restore length constraint
    op.alter_column(
        "user",
        "profile_picture",
        new_column_name="avatar_url",
        type_=sa.VARCHAR(length=500),
        nullable=True,
    )
