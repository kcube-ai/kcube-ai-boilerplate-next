from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
