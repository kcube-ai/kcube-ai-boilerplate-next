from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.core.database import engine
from app.models import Base  # Import your SQLAlchemy models here
from app.api import api_router

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=settings.FASTAPI_SESSION_KEY)
app.include_router(api_router)

# Create tables automatically (for development)
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Kcube AI Boilerplate API is running!"}
