import datetime
from pydantic import BaseModel
from typing import Optional


class SiteSettingCreate(BaseModel):
    key: str
    value: Optional[str] = None
    json_value: Optional[dict] = None


class SiteSettingUpdate(BaseModel):
    value: Optional[str] = None
    json_value: Optional[dict] = None


class SiteSettingOut(BaseModel):
    key: str
    value: Optional[str] = None
    json_value: Optional[dict] = None
    updated_at: Optional[datetime.datetime] = None
