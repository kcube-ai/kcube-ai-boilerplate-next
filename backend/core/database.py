"""
Database connection and session management.
Provides SQLModel engine configuration and session factory.
"""

from typing import Generator

from sqlmodel import Session, create_engine

from .config import settings

# Create database engine
engine = create_engine(
    settings.database_uri,
    future=True,
    pool_size=10,
    max_overflow=20,
)


def get_db() -> Generator[Session, None, None]:
    """Create a new database session."""
    with Session(engine) as session:
        yield session
