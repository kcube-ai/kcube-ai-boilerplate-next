from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.site_settings import SiteSettings

router = APIRouter()


@router.get("/settings")
def get_users(db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).all()
    return settings
