"""
Xero organization service for handling organization-specific operations.
Provides organization connection URL generation and connections retrieval.
"""

import json
from typing import List
from urllib.parse import urlencode
from uuid import UUID

import httpx
from pydantic import BaseModel

from backend.core.config import settings


class XeroConnectionInfo(BaseModel):
    """Xero connection information."""

    name: str
    tenant_id: str
    connection_id: str


class XeroKeyVaultTokens(BaseModel):
    """Xero tokens in Azure Key Vault."""

    access_token: str
    refresh_token: str


class XeroOrganizationLib:
    """Service for Xero organization operations."""

    def __init__(self):
        """Initialize with credentials."""
        self.client_id = settings.XERO_CLIENT_ID
        self.redirect_uri = settings.XERO_ORGANIZATION_REDIRECT_URI
        self.scopes = "openid email profile offline_access accounting.journals.read accounting.contacts.read accounting.reports.read accounting.settings.read accounting.budgets.read accounting.transactions.read accounting.attachments.read"
        self.auth_url = "https://login.xero.com/identity/connect/authorize"

    def get_connection_authorization_url(self) -> str:
        """Get Xero authorization URL for organization connection."""
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": self.scopes,
        }
        return f"{self.auth_url}?{urlencode(params)}"

    async def get_connections(self, access_token: str) -> List[XeroConnectionInfo]:
        """Get list of connected Xero organizations."""
        url = "https://api.xero.com/connections"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()

            return [
                XeroConnectionInfo(
                    connection_id=tenant.get("id", ""),
                    name=tenant.get("tenantName", ""),
                    tenant_id=tenant.get("tenantId", ""),
                )
                for tenant in data
            ]

    @staticmethod
    def get_key_vault_secret_name(user_id: UUID) -> str:
        """Generate Key Vault secret name for Xero tokens (xero-tokens-{user_id})."""
        return f"xero-tokens-{user_id}"

    @staticmethod
    def serialize_tokens(access_token: str, refresh_token: str) -> str:
        """Serialize Xero tokens to JSON string for Key Vault storage."""
        return json.dumps(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        )

    @staticmethod
    def deserialize_tokens(secret_value: str) -> XeroKeyVaultTokens:
        """Deserialize JSON string from Key Vault to XeroKeyVaultTokens."""
        data = json.loads(secret_value)
        return XeroKeyVaultTokens(
            access_token=data["access_token"],
            refresh_token=data["refresh_token"],
        )


# Global instance
xero_organization_lib = XeroOrganizationLib()
