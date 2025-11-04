"""
Xero service for handling login authentication.
Provides OAuth client creation and user info retrieval for Xero login.
"""

import base64
import json
from urllib.parse import urlencode

import httpx
from pydantic import BaseModel

from backend.core.config import settings


class XeroUserTokens(BaseModel):
    """Xero user tokens."""

    access_token: str
    refresh_token: str


class XeroUserInfo(BaseModel):
    """Xero user information."""

    email: str
    full_name: str
    tokens: XeroUserTokens


class XeroLib:
    """Service for Xero login authentication."""

    def __init__(self):
        """Initialize with credentials."""
        self.client_id = settings.XERO_CLIENT_ID
        self.client_secret = settings.XERO_CLIENT_SECRET
        self.login_redirect_uri = settings.XERO_LOGIN_REDIRECT_URI
        self.login_scopes = "openid email profile"
        self.token_url = "https://identity.xero.com/connect/token"
        self.auth_url = "https://login.xero.com/identity/connect/authorize"

    def get_login_authorization_url(self) -> str:
        """Get Xero authorization URL for login."""
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.login_redirect_uri,
            "response_type": "code",
            "scope": self.login_scopes,
        }
        return f"{self.auth_url}?{urlencode(params)}"

    def _decode_jwt_token(self, token: str) -> dict:
        """Decode JWT token to extract user information (without verification)."""
        # Split the JWT token into parts
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Invalid JWT token format")

        # Decode the payload (second part)
        payload = parts[1]
        # Add padding if necessary
        padding = len(payload) % 4
        if padding:
            payload += "=" * (4 - padding)

        # Decode base64
        decoded_bytes = base64.urlsafe_b64decode(payload)
        decoded_str = decoded_bytes.decode("utf-8")

        # Parse JSON
        return json.loads(decoded_str)

    async def get_user_info(self, code: str, redirect_uri: str) -> XeroUserInfo:
        """Exchange authorization code for user info and extract email/name."""
        async with httpx.AsyncClient() as client:
            # Exchange code for access token
            token_response = await client.post(
                self.token_url,
                data={
                    "code": code,
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
            )
            token_response.raise_for_status()
            tokens = token_response.json()

        # Get ID token from response
        id_token = tokens.get("id_token")
        if not id_token:
            raise ValueError("Failed to retrieve ID token from Xero")

        # Decode JWT to get user info
        user_info = self._decode_jwt_token(id_token)

        # Extract and validate user data
        email = user_info.get("email")
        full_name = user_info.get("name")
        if not email or not full_name:
            raise ValueError("Failed to retrieve user information from Xero")

        return XeroUserInfo(
            email=email,
            full_name=full_name,
            tokens=XeroUserTokens(
                access_token=tokens.get("access_token"),
                refresh_token=tokens.get("refresh_token"),
            ),
        )


# Global instance
xero_lib = XeroLib()
