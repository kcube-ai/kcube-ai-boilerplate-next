"""
RESTful API endpoints for user management operations.
Provides signup, login, verification, and profile management endpoints.
"""

import logging

from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel, field_validator

from backend.api.deps import CurrentUserAllowUnverifiedDep, CurrentUserDep, SessionDep
from backend.core.auth import create_access_token, get_pending_2fa_from_token, security
from backend.core.exceptions import InvalidEmailFormat, InvalidPasswordFormat
from backend.core.rate_limit import rate_limit
from backend.core.validation import (
    is_valid_email,
    is_valid_full_name,
    is_valid_password,
    is_valid_profile_picture,
    is_valid_signup_token,
    normalize_email,
    normalize_full_name,
)
from backend.models import Message, OAuth, OAuthUrl, UserPublic
from backend.modules.two_fa.two_fa import two_fa_service
from backend.services.google import google_service

from .background import send_verification_email_task, send_welcome_email_task
from .exceptions import (
    InvalidFullName,
    InvalidProfilePicture,
    InvalidSignupToken,
    UserAlreadyVerified,
)
from .user import user_service

logger = logging.getLogger(__name__)

router = APIRouter()


class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str

    @field_validator("email")
    @classmethod
    def validate_email_field(cls, v: str) -> str:
        """Validate email format."""
        if not is_valid_email(v):
            raise InvalidEmailFormat()
        return normalize_email(v)

    @field_validator("full_name")
    @classmethod
    def validate_full_name_field(cls, v: str) -> str:
        """Validate full name."""
        if not is_valid_full_name(v):
            raise InvalidFullName()
        return normalize_full_name(v)

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str) -> str:
        """Validate password."""
        if not is_valid_password(v):
            raise InvalidPasswordFormat()
        return v


class VerifySignupRequest(BaseModel):
    signup_token: str

    @field_validator("signup_token")
    @classmethod
    def validate_signup_token_field(cls, v: str) -> str:
        """Validate signup token."""
        if not is_valid_signup_token(v):
            raise InvalidSignupToken()
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email_field(cls, v: str) -> str:
        """Validate email format."""
        if not is_valid_email(v):
            raise InvalidEmailFormat()
        return normalize_email(v)


class UpdateUserRequest(BaseModel):
    full_name: str | None = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name_field(cls, v: str | None) -> str | None:
        """Validate full name."""
        if v is not None:
            if not is_valid_full_name(v):
                raise InvalidFullName()
            return normalize_full_name(v)
        return v


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password_field(cls, v: str) -> str:
        """Validate new password."""
        if not is_valid_password(v):
            raise InvalidPasswordFormat()
        return v


class SetPasswordRequest(BaseModel):
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password_field(cls, v: str) -> str:
        """Validate new password."""
        if not is_valid_password(v):
            raise InvalidPasswordFormat()
        return v


class UpdateProfilePictureRequest(BaseModel):
    profile_picture: str

    @field_validator("profile_picture")
    @classmethod
    def validate_profile_picture_field(cls, v: str) -> str:
        """Validate profile picture."""
        if not is_valid_profile_picture(v):
            raise InvalidProfilePicture()
        return v


class GoogleAuthCallbackRequest(BaseModel):
    code: str


@router.post(
    "/signup", response_model=OAuth, dependencies=[Depends(rate_limit(2, hours=24))]
)
def signup(
    user_data: SignupRequest,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """Sign up a new user and send verification email."""
    user = user_service.create(
        session,
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
    )

    # Create 2FA settings for user
    two_fa_service.create(session, user.id)

    # Send verification email in background
    background_tasks.add_task(
        send_verification_email_task,
        email=user.email,
        name=user.full_name,
        token=user.signup_token,
    )

    # Generate JWT token
    access_token = create_access_token(user.id)

    # Commit
    session.commit()

    return OAuth(
        access_token=access_token,
        user=user_service.to_public(user),
    )


@router.post(
    "/resend-verification",
    response_model=Message,
    dependencies=[Depends(rate_limit(1, minutes=5))],
)
def resend_verification(
    current_user: CurrentUserAllowUnverifiedDep,
    background_tasks: BackgroundTasks,
):
    """Resend verification email to unverified user."""
    if current_user.signup_verified:
        raise UserAlreadyVerified()

    # Send verification email in background
    background_tasks.add_task(
        send_verification_email_task,
        email=current_user.email,
        name=current_user.full_name,
        token=current_user.signup_token,
    )

    return Message(message="Verification email sent successfully")


@router.post("/verify-signup", response_model=UserPublic)
def verify_signup(
    current_user: CurrentUserAllowUnverifiedDep,
    data: VerifySignupRequest,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """Verify current user's signup with 6-digit verification code."""
    user = user_service.verify_signup(session, current_user.id, data.signup_token)

    # Send welcome email in background
    background_tasks.add_task(
        send_welcome_email_task,
        email=user.email,
        name=user.full_name,
    )

    # Commit
    session.commit()

    return user_service.to_public(user)


@router.post("/login", response_model=OAuth)
def login(data: LoginRequest, session: SessionDep):
    """Login user with email and password."""
    user = user_service.authenticate(session, data.email, data.password)

    # Check if user has 2FA enabled
    two_fa_enabled = user.two_factor_auth.is_enabled if user.two_factor_auth else False

    # Generate JWT token
    access_token = create_access_token(user.id, pending_2fa=two_fa_enabled)

    return OAuth(
        access_token=access_token,
        user=user_service.to_public(user, pending_2fa=two_fa_enabled),
    )


@router.get("/me", response_model=UserPublic)
def get_me(
    current_user: CurrentUserAllowUnverifiedDep,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Get current authenticated user profile (verified or unverified)."""
    # Extract pending_2fa status from JWT token
    token = credentials.credentials
    pending_2fa = get_pending_2fa_from_token(token)

    return user_service.to_public(current_user, pending_2fa=pending_2fa)


@router.put("/", response_model=UserPublic)
def update(
    current_user: CurrentUserDep,
    user_data: UpdateUserRequest,
    session: SessionDep,
):
    """Update current user's data."""
    user = user_service.update(
        session, current_user.id, **user_data.model_dump(exclude_unset=True)
    )

    # Commit
    session.commit()

    return user_service.to_public(user)


@router.delete("/", response_model=Message)
def delete(current_user: CurrentUserDep, session: SessionDep):
    """Delete current user's account."""
    user_service.delete(session, current_user.id)

    # Commit
    session.commit()

    return Message(message="User deleted successfully")


@router.post("/change-password", response_model=Message)
def change_password(
    current_user: CurrentUserDep,
    password_data: ChangePasswordRequest,
    session: SessionDep,
):
    """Change current user's password."""
    user_service.change_password(
        session,
        current_user.id,
        password_data.old_password,
        password_data.new_password,
    )

    # Commit
    session.commit()

    return Message(message="Password changed successfully")


@router.post("/set-password", response_model=Message)
def set_password(
    current_user: CurrentUserDep,
    password_data: SetPasswordRequest,
    session: SessionDep,
):
    """Set password for OAuth users who don't have a password yet."""
    user_service.set_password(
        session,
        current_user.id,
        password_data.new_password,
    )

    # Commit
    session.commit()

    return Message(message="Password set successfully")


@router.post(
    "/profile-picture",
    response_model=UserPublic,
    dependencies=[Depends(rate_limit(5, hours=1))],
)
def update_profile_picture(
    current_user: CurrentUserDep,
    data: UpdateProfilePictureRequest,
    session: SessionDep,
):
    """Upload or update current user's profile picture."""
    user = user_service.update_profile_picture(
        session, current_user.id, data.profile_picture
    )

    # Commit
    session.commit()

    return user_service.to_public(user)


@router.delete("/profile-picture", response_model=UserPublic)
def remove_profile_picture(
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Remove current user's profile picture."""
    user = user_service.remove_profile_picture(session, current_user.id)

    # Commit
    session.commit()

    return user_service.to_public(user)


@router.get("/google-login", response_model=OAuthUrl)
def google_login():
    """Get Google OAuth authorization URL."""
    auth_url = google_service.get_authorization_url()
    return OAuthUrl(url=auth_url)


@router.post("/google-login/callback", response_model=OAuth)
async def google_login_callback(
    data: GoogleAuthCallbackRequest,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """Handle Google OAuth callback with authorization code."""
    # Exchange code for user info
    user_info = await google_service.get_user_info(data.code)

    # Continue for existing user, create new user otherwise
    user = user_service.get_by_email(session, user_info.email)
    if not user:
        # Create new OAuth user
        user = user_service.create_oauth(
            session,
            email=user_info.email,
            full_name=user_info.full_name,
            auth_provider="google",
        )

        # Create 2FA settings for user
        two_fa_service.create(session, user.id)

        # Send welcome email in background
        background_tasks.add_task(
            send_welcome_email_task,
            email=user.email,
            name=user.full_name,
        )
    else:
        # Existing user - if unverified, mark as verified via OAuth
        if not user.signup_verified:
            user = user_service.verify_via_oauth(session, user, "google")

            # Send welcome email for newly verified user
            background_tasks.add_task(
                send_welcome_email_task,
                email=user.email,
                name=user.full_name,
            )

    # Generate JWT token
    access_token = create_access_token(user.id)

    # Commit
    session.commit()

    return OAuth(
        access_token=access_token,
        user=user_service.to_public(user),
    )
