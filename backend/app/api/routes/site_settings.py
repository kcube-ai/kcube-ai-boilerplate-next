from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.site_settings import SiteSettings

from app.dependencies.auth import auth_dependency

router = APIRouter()


@router.get("/settings")
def get_users(db: Session = Depends(get_db), payload: dict = Depends(auth_dependency)):
    settings = db.query(SiteSettings).all()
    return settings
