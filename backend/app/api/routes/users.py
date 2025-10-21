from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Users

from app.dependencies.auth import auth_dependency

router = APIRouter()


@router.get("/users")
def get_users(db: Session = Depends(get_db), payload: dict = Depends(auth_dependency)):
    users = db.query(Users).all()
    return users
