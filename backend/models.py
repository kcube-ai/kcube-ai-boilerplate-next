"""
SQLModel database models and schemas.
Defines core entities like User, Organization, and their relationships.
"""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from uuid import UUID, uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, Column, Enum as SQLEnum, Text
from sqlmodel import Field, Relationship, SQLModel


class BaseModel(SQLModel):
    """Base model with common fields for all tables."""

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class UserBase(SQLModel):
    """Base user model with shared fields."""

    email: str = Field(min_length=1, max_length=255, unique=True, index=True)
    full_name: str = Field(min_length=1, max_length=300)
    signup_verified: Optional[datetime] = Field(default=None)
    signup_token: Optional[str] = Field(default=None, max_length=255)
    auth_provider: str = Field(default="sample", max_length=50)
    profile_picture: Optional[str] = Field(default=None)
    is_admin: bool = Field(default=False, nullable=False)


class User(UserBase, BaseModel, table=True):
    """User model with authentication and profile data."""

    hashed_password: Optional[str] = Field(default=None, max_length=255)

    forgot_password_tokens: List["ForgotPassword"] = Relationship(
        back_populates="user", cascade_delete=True
    )
    two_factor_auth: Optional["TwoFactorAuth"] = Relationship(
        back_populates="user", cascade_delete=True
    )
    documents: List["Document"] = Relationship(
        back_populates="user", cascade_delete=True
    )
    knowledge: List["Knowledge"] = Relationship(
        back_populates="user", cascade_delete=True
    )
    chats: List["Chat"] = Relationship(back_populates="user", cascade_delete=True)
    xero_organizations: List["XeroOrganization"] = Relationship(
        back_populates="user", cascade_delete=True
    )


class UserPublic(SQLModel):
    """Public user model for API responses."""

    id: UUID
    email: str
    full_name: str
    signup_verified: Optional[datetime]
    auth_provider: str
    profile_picture: Optional[str]
    is_admin: bool
    two_fa_enabled: bool
    pending_2fa: bool = False
    has_password: bool
    created_at: datetime
    updated_at: datetime
    documents_count: int
    organizations_count: int


class OAuth(SQLModel):
    """Authentication response with token and user data."""

    access_token: str
    user: UserPublic


class Message(SQLModel):
    """Simple message response."""

    message: str


class OAuthUrl(SQLModel):
    """OAuth authorization URL response."""

    url: str


class TwoFactorAuthBase(SQLModel):
    """Base two-factor authentication model."""

    is_enabled: bool = Field(default=False)


class TwoFactorAuth(TwoFactorAuthBase, BaseModel, table=True):
    """Two-factor authentication settings (TOTP only)."""

    __tablename__ = "two_factor_auth"

    user_id: UUID = Field(foreign_key="user.id", unique=True)
    totp_secret: str = Field(min_length=1, max_length=255)
    verified_at: Optional[datetime] = Field(default=None)

    user: "User" = Relationship(back_populates="two_factor_auth")


class ForgotPasswordBase(SQLModel):
    """Base forgot password model."""

    token: str = Field(min_length=1, max_length=255, unique=True, index=True)
    expires_at: datetime
    used_at: Optional[datetime] = Field(default=None)


class ForgotPassword(ForgotPasswordBase, BaseModel, table=True):
    """Password reset tokens."""

    __tablename__ = "forgot_password"

    user_id: UUID = Field(foreign_key="user.id", index=True)

    user: "User" = Relationship(back_populates="forgot_password_tokens")


class DocumentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    INDEXED = "INDEXED"
    FAILED = "FAILED"


class Document(BaseModel, table=True):
    """Document model representing user-uploaded files."""

    user_id: UUID = Field(foreign_key="user.id", index=True)
    name: str = Field(min_length=1, max_length=300)
    size: str = Field(default=None, max_length=20)
    status: DocumentStatus = Field(
        sa_column=Column(
            SQLEnum(DocumentStatus, name="document_status_enum"),
            default=DocumentStatus.PENDING,
        )
    )

    user: "User" = Relationship(back_populates="documents")


class Knowledge(BaseModel, table=True):
    """Document chunk model for storing file parts."""

    source_id: UUID = Field(nullable=False, description="The document UUID")
    content: str = Field(sa_column=Column(Text, nullable=False))
    chunk_number: int = Field(ge=0)
    meta_data: Dict = Field(sa_column=Column(JSON, default=None))
    embedding: List[float] = Field(
        sa_column=Column(
            Vector(3072),
            default=None,
        )
    )
    user_id: UUID = Field(foreign_key="user.id", index=True)

    user: "User" = Relationship(back_populates="knowledge")


class BookDemoBase(SQLModel):
    """Base book demo model."""

    name: str = Field(min_length=1, max_length=300)
    email: str = Field(min_length=1, max_length=255, index=True)
    company_name: str = Field(min_length=1, max_length=300)
    message: Optional[str] = Field(default=None, max_length=500)
    status: str = Field(default="pending", max_length=50)


class BookDemo(BookDemoBase, BaseModel, table=True):
    """Book demo requests from potential customers."""

    __tablename__ = "book_demo"


class Chat(BaseModel, table=True):
    """Chat model representing a conversation session."""

    user_id: UUID = Field(foreign_key="user.id", index=True)
    title: str = Field(min_length=1, max_length=500)

    user: "User" = Relationship(back_populates="chats")
    messages: List["Message"] = Relationship(
        back_populates="chat",
        cascade_delete=True,
        sa_relationship_kwargs={"order_by": "Message.created_at"},
    )


class MessageRole(str, Enum):
    USER = "USER"
    SYSTEM = "SYSTEM"
    ASSISTANT = "ASSISTANT"


class Message(BaseModel, table=True):
    """Message model representing individual chat messages."""

    chat_id: UUID = Field(foreign_key="chat.id", index=True)
    role: MessageRole = Field(
        sa_column=Column(
            SQLEnum(MessageRole, name="message_role_enum"),
            nullable=False,
        )
    )
    content: str = Field(sa_column=Column(Text, nullable=False))
    meta_data: Optional[Dict] = Field(sa_column=Column(JSON, default=None))

    chat: "Chat" = Relationship(back_populates="messages")


class XeroOrganizationStatus(str, Enum):
    """Xero organization connection status."""

    PENDING = "PENDING"
    SYNCING = "SYNCING"
    RESYNCING = "RESYNCING"
    FAILED = "FAILED"
    CONNECTED = "CONNECTED"


class XeroOrganizationBase(BaseModel):
    """Base Xero organization model."""

    name: str = Field(min_length=1, max_length=300)
    tenant_id: str = Field(min_length=1, max_length=255)
    connection_id: str = Field(min_length=1, max_length=255)
    status: XeroOrganizationStatus = Field(default=XeroOrganizationStatus.PENDING)
    last_sync_at: Optional[datetime] = Field(default=None)


class XeroOrganization(XeroOrganizationBase, table=True):
    """Xero organization connection tracking."""

    __tablename__ = "xero_organization"

    user_id: UUID = Field(foreign_key="user.id", index=True)

    user: "User" = Relationship(back_populates="xero_organizations")
