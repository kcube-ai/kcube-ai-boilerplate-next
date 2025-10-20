from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/kcube_db"

    TOKEN_SECRET: str = "AddATokenSecret"

    # Add token expiration in minutes
    ACCESS_TOKEN_EXPIRE: int = 30
    REFRESH_TOKEN_EXPIRE: int = 120

    class Config:
        env_file = ".env"


settings = Settings()
