from pydantic import BaseModel, EmailStr, Field


class UserData(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    bio: str
    role: str
    updated_at: str
    created_at: str


class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserEditRequest(BaseModel):
    first_name: str = Field(..., max_length=50)
    last_name: str = Field(..., max_length=50)
    bio: str = Field("", max_length=1200)


class UserEditResponse(BaseModel):
    message: str
    user: UserData
