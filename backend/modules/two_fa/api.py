"""
2FA (Two-Factor Authentication) API routes.
Provides endpoints for managing 2FA settings and verification.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel, field_validator

from backend.api.deps import CurrentUserAllowUnverifiedDep, CurrentUserDep, SessionDep
from backend.core.auth import create_access_token
from backend.core.rate_limit import rate_limit
from backend.core.validation import is_valid_totp
from backend.models import UserPublic
from backend.modules.two_fa.two_fa import two_fa_service
from backend.modules.user import user_service

from .exceptions import InvalidTotpCode

router = APIRouter()


class TwoFactorAuthVerifyRequest(BaseModel):
    totp: str

    @field_validator("totp")
    @classmethod
    def validate_token_field(cls, v: str) -> str:
        """Validate token format."""
        if not is_valid_totp(v):
            raise InvalidTotpCode()
        return v


class URL(BaseModel):
    url: str


class Message(BaseModel):
    message: str


class Auth(BaseModel):
    """Authentication response with token and user data."""

    access_token: str
    user: UserPublic


@router.get("/setup", response_model=URL)
def setup(current_user: CurrentUserDep, session: SessionDep):
    """Get QR code URL for 2FA setup."""
    url = two_fa_service.get_qr_url(session, current_user.id, current_user.email)

    return URL(url=url)


@router.post("/verify", dependencies=[Depends(rate_limit(5, minutes=15))])
def verify(
    request: TwoFactorAuthVerifyRequest,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Verify 2FA token for a user."""
    two_fa_service.verify(session, current_user.id, request.totp)

    session.commit()
    return Message(message="2FA verified and activated")


@router.post("/verify-code", response_model=Auth)
def verify_code(
    current_user: CurrentUserAllowUnverifiedDep,
    request: TwoFactorAuthVerifyRequest,
    session: SessionDep,
):
    """Verify 2FA code during login and return full JWT token."""
    # Verify the TOTP code
    two_fa_service.verify_code(session, current_user.id, request.totp)

    # Return new token with pending_2fa=False
    access_token = create_access_token(current_user.id, pending_2fa=False)

    return Auth(
        access_token=access_token,
        user=user_service.to_public(current_user, pending_2fa=False),
    )


@router.post("/disable")
def disable(current_user: CurrentUserDep, session: SessionDep):
    """Disable 2FA for current user."""
    two_fa_service.disable(session, current_user.id)

    # Commit
    session.commit()

    return Message(message="2FA disabled")
