from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ConversationData(BaseModel):
    id: str
    title: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
