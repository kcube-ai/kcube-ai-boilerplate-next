from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class ConversationData(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class ConversationCreate(BaseModel):
    title: Optional[str] = None


class ConversationUpdate(BaseModel):
    title: Optional[str] = None
