"""
Google OAuth service for handling Google authentication flow.
Provides OAuth client creation and user info retrieval.
"""

from urllib.parse import urlencode

import httpx
from pydantic import BaseModel

from backend.core.config import settings


class GoogleUserInfo(BaseModel):
    """Google OAuth user information."""

    email: str
    full_name: str
    avatar_url: str | None = None


class GoogleOAuthService:
    """Service for Google OAuth operations."""

    def __init__(self):
        """Initialize with OAuth credentials."""
        self.client_id = settings.GOOGLE_OAUTH_CLIENT_ID
        self.client_secret = settings.GOOGLE_OAUTH_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_OAUTH_REDIRECT_URI
        self.scopes = "openid email profile"
        self.token_url = "https://oauth2.googleapis.com/token"
        self.auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
        self.userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"

    def get_authorization_url(self) -> str:
        """Get Google OAuth authorization URL."""
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": self.scopes,
            "access_type": "offline",
            "prompt": "consent",
        }
        return f"{self.auth_url}?{urlencode(params)}"

    async def get_user_info(self, code: str) -> GoogleUserInfo:
        """Exchange authorization code for user info and extract email/name."""
        async with httpx.AsyncClient() as client:
            # Exchange code for access token
            token_response = await client.post(
                self.token_url,
                data={
                    "code": code,
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "redirect_uri": self.redirect_uri,
                    "grant_type": "authorization_code",
                },
            )
            token_response.raise_for_status()
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            if not access_token:
                raise ValueError("Failed to retrieve access token from Google")

            # Fetch user info using access token
            userinfo_response = await client.get(
                self.userinfo_url,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            userinfo_response.raise_for_status()
            user_info = userinfo_response.json()

            # Extract and validate user data
            email = user_info.get("email")
            avatar_url = user_info.get("picture")
            full_name = user_info.get("name", email.split("@")[0])
            if not email or not full_name:
                raise ValueError("Failed to retrieve user information from Google")

            return GoogleUserInfo(
                email=email,
                full_name=full_name,
                avatar_url=avatar_url,
            )


# Global instance
google_oauth_service = GoogleOAuthService()
