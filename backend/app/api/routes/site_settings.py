from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.site_settings import SiteSettings

router = APIRouter()


@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).all()
    return settings


@router.get("/settings/themes")
def get_themes(db: Session = Depends(get_db)):
    theme_value = (
        db.query(SiteSettings.json_value)
        .filter(SiteSettings.key == "themes")
        .scalar()  # returns the first column of the first row directly
    )
    return theme_value
