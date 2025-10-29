from fastapi import APIRouter
from app.api.routes import users
from app.api.routes import auth
from app.api.routes import oauth
from app.api.routes import site_settings
from app.api.routes import conversations


api_router = APIRouter()
api_router.include_router(users.router, prefix="/api", tags=["users"])
api_router.include_router(auth.router, prefix="/api", tags=["auth"])
api_router.include_router(oauth.router, prefix="/api", tags=["oauth"])
api_router.include_router(site_settings.router,
                          prefix="/api", tags=["site-settings"])
api_router.include_router(conversations.router,
                          prefix="/api", tags=["conversations"])
