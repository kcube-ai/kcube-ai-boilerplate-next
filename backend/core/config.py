"""
Application configuration management using Pydantic settings.
Handles environment variables and configuration validation.
"""

from typing import List

from pydantic import BaseModel, computed_field
from pydantic_core import Url

from .env import get_env, get_env_bool, get_env_int


class Settings(BaseModel):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = get_env("APP_NAME")
    APP_VERSION: str = get_env("APP_VERSION")
    APP_PUBLIC_URL: str = get_env("APP_PUBLIC_URL")
    ENABLE_USER_EMAILS: bool = get_env_bool("ENABLE_USER_EMAILS")

    # API Configuration
    API_PREFIX: str = get_env("API_PREFIX")

    # CORS Configuration
    CORS_ORIGINS: str = get_env("CORS_ORIGINS")
    CORS_ALLOW_HEADERS: str = get_env("CORS_ALLOW_HEADERS")
    CORS_ALLOW_METHODS: str = get_env("CORS_ALLOW_METHODS")
    CORS_ALLOW_CREDENTIALS: bool = get_env_bool("CORS_ALLOW_CREDENTIALS")

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse comma-separated CORS origins into a list."""
        return [
            origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()
        ]

    @property
    def cors_methods_list(self) -> List[str]:
        """Parse comma-separated CORS methods into a list."""
        return [
            method.strip()
            for method in self.CORS_ALLOW_METHODS.split(",")
            if method.strip()
        ]

    # JWT
    JWT_ALGORITHM: str = get_env("JWT_ALGORITHM")
    JWT_SECRET_KEY: str = get_env("JWT_SECRET_KEY")
    JWT_EXPIRE_MINUTES_DELTA: int = get_env_int("JWT_EXPIRE_MINUTES_DELTA")

    # SendGrid
    SENDGRID_API_KEY: str = get_env("SENDGRID_API_KEY")
    SENDGRID_FROM_EMAIL: str = get_env("SENDGRID_FROM_EMAIL")
    SENDGRID_VERIFY_SSL: bool = get_env_bool("SENDGRID_VERIFY_SSL")

    # Postgres
    POSTGRES_DB: str = get_env("POSTGRES_DB")
    POSTGRES_USER: str = get_env("POSTGRES_USER")
    POSTGRES_PORT: int = get_env_int("POSTGRES_PORT")
    POSTGRES_SERVER: str = get_env("POSTGRES_SERVER")
    POSTGRES_PASSWORD: str = get_env("POSTGRES_PASSWORD")

    # Redis
    REDIS_URL: str = get_env("REDIS_URL")

    # Tokens Expiration
    PASSWORD_RESET_TOKEN_EXPIRY_HOURS: int = get_env_int(
        "PASSWORD_RESET_TOKEN_EXPIRY_HOURS"
    )

    # Google OAuth
    GOOGLE_OAUTH_CLIENT_ID: str = get_env("GOOGLE_OAUTH_CLIENT_ID")
    GOOGLE_OAUTH_CLIENT_SECRET: str = get_env("GOOGLE_OAUTH_CLIENT_SECRET")
    GOOGLE_OAUTH_REDIRECT_URI: str = get_env("GOOGLE_OAUTH_REDIRECT_URI")

    @computed_field
    @property
    def database_uri(self) -> str:
        """Build the database URL with UTC timezone setting."""
        return Url.build(
            scheme="postgresql",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
            query="options=-c timezone=UTC",
        ).unicode_string()


# Global settings instance
settings = Settings()
