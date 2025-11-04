"""
Database access layer for user management.
Provides CRUD operations for user entities in the database.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlmodel import Session, select

from backend.models import User


class UserDB:
    """Repository for user database operations."""

    def get_by_id(self, session: Session, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        return session.get(User, user_id)

    def get_by_email(self, session: Session, email: str) -> Optional[User]:
        """Get user by email address."""
        query = select(User).where(User.email == email)
        return session.exec(query).first()

    def create(
        self,
        session: Session,
        email: str,
        full_name: str,
        hashed_password: str,
        signup_verified: datetime | None = None,
        signup_token: str | None = None,
        auth_provider: str = "sample",
    ) -> User:
        """Create a new user."""
        user = User(
            email=email,
            full_name=full_name,
            hashed_password=hashed_password,
            signup_verified=signup_verified,
            signup_token=signup_token,
            auth_provider=auth_provider,
        )
        session.add(user)
        session.flush()
        return user

    def update(self, session: Session, user: User, user_data: dict) -> User:
        """Update existing user object."""
        for key, value in user_data.items():
            setattr(user, key, value)
        user.updated_at = datetime.now()
        session.flush()
        return user

    def delete(self, session: Session, user: User) -> None:
        """Delete existing user object."""
        session.delete(user)
        session.flush()

    def exists_by_email(self, session: Session, email: str) -> bool:
        """Check if user exists by email."""
        query = select(User.id).where(User.email == email)
        return session.exec(query).first() is not None


# Global instance
user_db = UserDB()
