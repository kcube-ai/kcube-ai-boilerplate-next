"""
RESTful API endpoints for Xero organization management.
Provides organization connection and management functionality.
"""

from typing import List

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel

from backend.api.deps import CurrentUserDep, SessionDep
from backend.core.config import settings
from backend.models import Message, OAuthUrl, XeroOrganization
from backend.modules.two_fa.two_fa import two_fa_service
from backend.modules.user import user_service
from backend.modules.user.background import send_welcome_email_task
from backend.modules.xero.lib import xero_lib
from backend.services.azure_key_vault import azure_key_vault_service

from .lib import xero_organization_lib
from .organization import xero_organization_service

router = APIRouter()


# Request models
class XeroOrgConnectCallbackRequest(BaseModel):
    code: str


@router.get("/list", response_model=List[XeroOrganization])
def get_list(
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Get all Xero organizations connected by the current user."""
    organizations = xero_organization_service.get_by_user_id(session, current_user.id)
    return organizations


@router.get("/connect", response_model=OAuthUrl)
def connect():
    """Get Xero OAuth authorization URL for organization connection."""
    auth_url = xero_organization_lib.get_connection_authorization_url()
    return OAuthUrl(url=auth_url)


@router.post("/connect/callback", response_model=Message)
async def connect_callback(
    data: XeroOrgConnectCallbackRequest,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """Handle Xero organization connection OAuth callback with authorization code."""
    user_info = await xero_lib.get_user_info(
        data.code, settings.XERO_ORGANIZATION_REDIRECT_URI
    )

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

    # Get Xero connections/organizations
    connections = await xero_organization_lib.get_connections(
        access_token=user_info.tokens.access_token
    )

    # Save new organizations
    new_organizations = xero_organization_service.save_new(
        session, user.id, connections
    )

    # Store tokens in Azure Key Vault (after commit)
    secret_name = xero_organization_lib.get_key_vault_secret_name(user.id)
    secret_value = xero_organization_lib.serialize_tokens(
        access_token=user_info.tokens.access_token,
        refresh_token=user_info.tokens.refresh_token,
    )
    azure_key_vault_service.set_secret(secret_name, secret_value)

    # Commit
    session.commit()

    # TODO: Data factory call from here to sync data can be added later

    return Message(message="Organization connected successfully")
