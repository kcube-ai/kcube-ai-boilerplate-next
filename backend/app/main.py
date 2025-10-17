from fastapi import FastAPI
from app.core.database import engine
from app.models import Base  # Import your SQLAlchemy models here
from app.api import api_router

app = FastAPI()
app.include_router(api_router)

# Create tables automatically (for development)
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Kcube AI Boilerplate API is running!"}
