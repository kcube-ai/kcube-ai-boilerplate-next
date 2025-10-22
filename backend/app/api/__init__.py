from fastapi import APIRouter
from app.api.routes import users
from app.api.routes import auth
from app.api.routes import oauth


api_router = APIRouter()
api_router.include_router(users.router, prefix="/api", tags=["users"])
api_router.include_router(auth.router, prefix="/api", tags=["auth"])
api_router.include_router(oauth.router, prefix="/api", tags=["oauth"])
