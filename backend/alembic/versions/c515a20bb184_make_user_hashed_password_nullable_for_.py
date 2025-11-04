"""Make user hashed_password nullable for OAuth users

Revision ID: c515a20bb184
Revises: 4046695ae2c6
Create Date: 2025-10-26 15:04:24.083883

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c515a20bb184"
down_revision: Union[str, None] = "4046695ae2c6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Make hashed_password nullable for OAuth users
    op.execute(
        """
        ALTER TABLE "user"
        ALTER COLUMN hashed_password DROP NOT NULL
        """
    )

    # Set hashed_password to NULL for existing OAuth users (google/xero)
    # Keep passwords for 'sample' auth_provider users
    op.execute(
        """
        UPDATE "user"
        SET hashed_password = NULL
        WHERE auth_provider <> 'sample'
        """
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Before making column NOT NULL, we need to set a value for NULL passwords
    # Generate a placeholder bcrypt hash for OAuth users who don't have passwords
    # This is a placeholder - OAuth users won't be able to login with password anyway
    op.execute(
        """
        UPDATE "user"
        SET hashed_password = '$2b$12$placeholder.hash.for.oauth.users.only'
        WHERE hashed_password IS NULL
        """
    )

    # Make hashed_password non-nullable again
    op.execute(
        """
        ALTER TABLE "user"
        ALTER COLUMN hashed_password SET NOT NULL
        """
    )
