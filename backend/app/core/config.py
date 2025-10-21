from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Base URl
    BASE_URL: str = "localhost:8000"

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/kcube_db"

    # Tokens
    TOKEN_SECRET: str = "AddATokenSecret"
    ACCESS_TOKEN_EXPIRE: int = 30
    REFRESH_TOKEN_EXPIRE: int = 120

    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str

    class Config:
        env_file = ".env"


settings = Settings()
