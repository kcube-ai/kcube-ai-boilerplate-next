"""
RESTful API endpoints for forgot password management operations.
Provides token creation, validation, and expiration endpoints.
"""

from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, field_validator

from backend.api.deps import SessionDep
from backend.core.exceptions import InvalidEmailFormat, InvalidPasswordFormat
from backend.core.rate_limit import rate_limit
from backend.core.validation import is_valid_email, is_valid_password, normalize_email
from backend.modules.user.user import user_service

from .background import (
    send_password_reset_email_task,
    send_password_reset_success_email_task,
)
from .forgot_password import forgot_password_service

router = APIRouter()


# Request models
class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email_field(cls, v: str) -> str:
        """Validate email format."""
        if not is_valid_email(v):
            raise InvalidEmailFormat()
        return normalize_email(v)


class ForgotPasswordVerifyRequest(BaseModel):
    token: str
    user_id: UUID
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password_field(cls, v: str) -> str:
        """Validate new password."""
        if not is_valid_password(v):
            raise InvalidPasswordFormat()
        return v


# Response models
class Message(BaseModel):
    """Simple message response."""

    message: str


@router.post(
    "/", response_model=Message, dependencies=[Depends(rate_limit(3, hours=1))]
)
def request(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    session: SessionDep,
):
    """Request a password reset and send reset email to user."""
    user = user_service.get_by_email(session, data.email)
    if not user:
        return Message(message="Password reset email sent")

    # Create token
    forgot_password = forgot_password_service.create(session, user.id)

    # Send email
    background_tasks.add_task(
        send_password_reset_email_task,
        email=user.email,
        name=user.full_name,
        token=forgot_password.token,
        user_id=str(user.id),
    )

    # Commit
    session.commit()

    return Message(message="Password reset email sent")


@router.post("/verify", response_model=Message)
def verify(
    data: ForgotPasswordVerifyRequest,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """Verify password reset token and update user's password."""
    # Verify token (raises exception if invalid/expired)
    forgot_password_service.verify(session, data.token, data.user_id)

    # Reset password
    user = user_service.reset_password(session, data.user_id, data.new_password)

    # Send success email
    background_tasks.add_task(
        send_password_reset_success_email_task,
        email=user.email,
        name=user.full_name,
    )

    # Commit
    session.commit()

    return Message(message="Password reset successfully")
