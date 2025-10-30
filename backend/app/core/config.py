from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Base URl
    BASE_URL: str = "localhost:8000"

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/kcube-boilerplate-db"

    # API
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = ""
    OPENAI_API_VERSION: str = ""

    # Frontend
    FRONTEND_URL: str = "localhost:5173"

    # Keys
    FASTAPI_SESSION_KEY: str = "SuperSecretKey"

    # Tokens
    TOKEN_SECRET: str = "SuperSecretKey"
    ACCESS_TOKEN_EXPIRE: int = 30
    REFRESH_TOKEN_EXPIRE: int = 120

    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str

    # OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    META_CLIENT_ID: str
    META_CLIENT_SECRET: str
    MICROSOFT_CLIENT_ID: str
    MICROSOFT_CLIENT_SECRET: str
    MICROSOFT_TENANT_ID: str

    class Config:
        env_file = ".env"


settings = Settings()
