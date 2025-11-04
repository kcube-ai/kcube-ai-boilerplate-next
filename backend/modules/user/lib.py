"""
User module utility functions.
Provides helper functions for user-related operations and transformations.
"""

from backend.models import User, UserPublic


def user_to_public(user: User, pending_2fa: bool = False) -> UserPublic:
    """Convert User model to UserPublic with 2FA status and counts."""
    two_fa_enabled = user.two_factor_auth.is_enabled if user.two_factor_auth else False
    has_password = bool(user.hashed_password)
    documents_count = len(user.documents) if user.documents else 0
    organizations_count = len(user.xero_organizations) if user.xero_organizations else 0

    return UserPublic(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        signup_verified=user.signup_verified,
        auth_provider=user.auth_provider,
        profile_picture=user.profile_picture,
        is_admin=user.is_admin,
        two_fa_enabled=two_fa_enabled,
        pending_2fa=pending_2fa,
        has_password=has_password,
        created_at=user.created_at,
        updated_at=user.updated_at,
        documents_count=documents_count,
        organizations_count=organizations_count,
    )
