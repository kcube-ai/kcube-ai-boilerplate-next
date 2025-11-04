"""
User service layer for business logic implementation.
Handles user creation, authentication, and management operations.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlmodel import Session

from backend.core.password import password_manager
from backend.core.token import token_manager
from backend.models import User, UserPublic

from .db import user_db
from .exceptions import (
    EmailAlreadyExists,
    InvalidCredentials,
    InvalidPasswordChange,
    InvalidVerificationCode,
    PasswordAlreadyExists,
    UserAlreadyVerified,
    UserNotFound,
)
from .lib import user_to_public


class UserService:
    """Service class for user business logic."""

    def get(self, session: Session, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        return user_db.get_by_id(session, user_id)

    def get_by_email(self, session: Session, email: str) -> Optional[User]:
        """Get user by email (returns full user for auth)."""
        return user_db.get_by_email(session, email)

    def exists_by_email(self, session: Session, email: str) -> bool:
        """Check if a user exists by email."""
        return user_db.exists_by_email(session, email)

    def create(
        self,
        session: Session,
        email: str,
        password: str,
        full_name: str,
    ) -> User:
        """Create a new user with signup verification."""
        # Check if user already exists
        if user_db.exists_by_email(session, email):
            raise EmailAlreadyExists(email)

        # Hash password
        hashed_password = password_manager.get_hash(password)

        # Generate signup token
        signup_token = token_manager.generate_signup_token()

        # Create user
        user = user_db.create(
            session,
            email=email,
            full_name=full_name,
            hashed_password=hashed_password,
            signup_verified=None,
            signup_token=signup_token,
        )

        return user

    def create_oauth(
        self,
        session: Session,
        email: str,
        full_name: str,
        auth_provider: str,
    ) -> User:
        """
        Create a user from OAuth provider.
        These users are pre-verified since they come from trusted providers.
        """
        # Check if user already exists
        if user_db.exists_by_email(session, email):
            raise ValueError(f"User with email {email} already exists")

        # Create user
        user = user_db.create(
            session,
            email=email,
            full_name=full_name,
            hashed_password=None,
            signup_verified=datetime.now(),
            signup_token=None,
            auth_provider=auth_provider,
        )

        return user

    def update(self, session: Session, user_id: UUID, **kwargs) -> User:
        """Update user data."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))

        if "password" in kwargs:
            kwargs["hashed_password"] = password_manager.get_hash(
                kwargs.pop("password")
            )

        return user_db.update(session, user, kwargs)

    def delete(self, session: Session, user_id: UUID) -> None:
        """Delete a user."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))

        user_db.delete(session, user)

    def verify_password(self, user: User, password: str) -> bool:
        """Verify user password."""
        if not user.hashed_password:
            return False
        return password_manager.verify(password, user.hashed_password)

    def authenticate(self, session: Session, email: str, password: str) -> User:
        """Authenticate user with email and password."""
        user = user_db.get_by_email(session, email)
        if not user:
            raise InvalidCredentials()
        if not self.verify_password(user, password):
            raise InvalidCredentials()

        return user

    def change_password(
        self, session: Session, user_id: UUID, old_password: str, new_password: str
    ) -> User:
        """Change user password after verifying old password."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))
        if not self.verify_password(user, old_password):
            raise InvalidPasswordChange()

        # Update password on fetched user object
        user.hashed_password = password_manager.get_hash(new_password)
        user.updated_at = datetime.now()
        session.flush()

        return user

    def reset_password(
        self, session: Session, user_id: UUID, new_password: str
    ) -> User:
        """Reset user password without requiring old password (for forgot password flow)."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))

        # Update password on fetched user object
        user.hashed_password = password_manager.get_hash(new_password)
        user.updated_at = datetime.now()
        session.flush()

        return user

    def set_password(self, session: Session, user_id: UUID, new_password: str) -> User:
        """Set password for users without a password (e.g., OAuth users)."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))
        if user.hashed_password:
            raise PasswordAlreadyExists()

        # Update password on fetched user object
        user.hashed_password = password_manager.get_hash(new_password)
        user.updated_at = datetime.now()
        session.flush()

        return user

    def update_profile_picture(
        self, session: Session, user_id: UUID, profile_picture: str
    ) -> User:
        """Update user profile picture with base64 data."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))

        # Update profile picture
        user.profile_picture = profile_picture
        user.updated_at = datetime.now()
        session.flush()

        return user

    def remove_profile_picture(self, session: Session, user_id: UUID) -> User:
        """Remove user profile picture."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))

        # Remove profile picture
        user.profile_picture = None
        user.updated_at = datetime.now()
        session.flush()

        return user

    def verify_signup(self, session: Session, user_id: UUID, signup_token: str) -> User:
        """Verify user signup with user_id and 6-digit signup token."""
        user = user_db.get_by_id(session, user_id)
        if not user:
            raise UserNotFound(str(user_id))
        if user.signup_verified:
            raise UserAlreadyVerified()
        if user.signup_token != signup_token:
            raise InvalidVerificationCode()

        # Mark as verified on fetched user object
        user.signup_token = None
        user.signup_verified = datetime.now()
        user.updated_at = datetime.now()
        session.flush()

        return user

    def verify_via_oauth(
        self, session: Session, user: User, auth_provider: str
    ) -> User:
        """Verify an existing unverified user via OAuth provider."""
        if user.signup_verified:
            # Already verified, just return the user
            return user

        # Mark as verified via OAuth provider
        user.signup_token = None
        user.signup_verified = datetime.now()
        user.auth_provider = auth_provider
        user.updated_at = datetime.now()
        session.flush()

        return user

    def to_public(self, user: User, pending_2fa: bool = False) -> UserPublic:
        """Convert User model to UserPublic with 2FA status."""
        return user_to_public(user, pending_2fa)


# Global instance
user_service = UserService()
