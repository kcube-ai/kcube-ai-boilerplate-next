"""
RESTful API endpoints for Xero OAuth authentication.
Provides Xero login and callback handling.
"""

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel

from backend.api.deps import SessionDep
from backend.core.auth import create_access_token
from backend.core.config import settings
from backend.models import OAuth, OAuthUrl
from backend.modules.two_fa.two_fa import two_fa_service
from backend.modules.user import user_service
from backend.modules.user.background import send_welcome_email_task

from .lib import xero_lib

router = APIRouter()


# Request models
class XeroOAuthCallbackRequest(BaseModel):
    code: str


@router.get("/login", response_model=OAuthUrl)
def xero_login():
    """Get Xero OAuth authorization URL for login."""
    auth_url = xero_lib.get_login_authorization_url()
    return OAuthUrl(url=auth_url)


@router.post("/login/callback", response_model=OAuth)
async def xero_login_callback(
    data: XeroOAuthCallbackRequest,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """Handle Xero OAuth callback with authorization code."""
    # Exchange code for user info
    user_info = await xero_lib.get_user_info(
        data.code, settings.XERO_LOGIN_REDIRECT_URI
    )

    # Continue for existing user, create new user otherwise
    user = user_service.get_by_email(session, user_info.email)
    if not user:
        # Create new OAuth user
        user = user_service.create_oauth(
            session,
            email=user_info.email,
            full_name=user_info.full_name,
            auth_provider="xero",
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
        if not user.signup_verified:
            user = user_service.verify_via_oauth(session, user, "xero")

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
