"""
RESTful API endpoints for book demo operations.
Provides endpoints for submitting and managing demo requests.
"""

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, field_validator

from backend.api.deps import SessionDep
from backend.core.exceptions import InvalidEmailFormat, InvalidValue
from backend.core.rate_limit import rate_limit
from backend.core.validation import is_valid_email, normalize_email

from .background import send_user_confirmation_task
from .book_demo import book_demo_service

router = APIRouter()


class BookDemoRequest(BaseModel):
    """Request model for booking a demo."""

    name: str
    email: str
    company_name: str
    message: str | None = None

    @field_validator("email")
    @classmethod
    def validate_email_field(cls, v: str) -> str:
        """Validate email format."""
        if not is_valid_email(v):
            raise InvalidEmailFormat()
        return normalize_email(v)

    @field_validator("name")
    @classmethod
    def validate_name_field(cls, v: str) -> str:
        """Validate name."""
        v = v.strip()
        if len(v) < 1 or len(v) > 300:
            raise InvalidValue("Name must be between 1 and 300 characters")
        return v

    @field_validator("company_name")
    @classmethod
    def validate_company_name_field(cls, v: str) -> str:
        """Validate company name."""
        v = v.strip()
        if len(v) < 1 or len(v) > 300:
            raise InvalidValue("Company name must be between 1 and 300 characters")
        return v

    @field_validator("message")
    @classmethod
    def validate_message_field(cls, v: str | None) -> str | None:
        """Validate message."""
        if v is not None:
            v = v.strip()
            if len(v) > 500:
                raise InvalidValue("Message must be less than 500 characters")
            return v if len(v) > 0 else None
        return None


class Message(BaseModel):
    """Simple message response."""

    message: str


@router.post(
    "/", response_model=Message, dependencies=[Depends(rate_limit(2, hours=1))]
)
def create(
    data: BookDemoRequest,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """Submit a new demo request."""
    demo = book_demo_service.create(
        session,
        name=data.name,
        email=data.email,
        company_name=data.company_name,
        message=data.message,
    )

    # Send confirmation email to user in background
    background_tasks.add_task(
        send_user_confirmation_task, demo.name, demo.email, demo.company_name
    )

    # Commit
    session.commit()

    return Message(message="Demo request submitted successfully")
