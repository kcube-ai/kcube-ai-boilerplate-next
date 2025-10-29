from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class ChatMessageData(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    tokens_used: int
    created_at: Optional[datetime]


class ChatMessageCreate(BaseModel):
    conversation_id: str
    role: str
    content: str
    tokens_used: Optional[int] = 0
