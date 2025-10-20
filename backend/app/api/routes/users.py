from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Users

from app.dependencies.auth import auth_dependency

router = APIRouter()


@router.get("/users", dependencies=[Depends(auth_dependency)])
def get_users(db: Session = Depends(get_db)):
    users = db.query(Users).all()
    return users
