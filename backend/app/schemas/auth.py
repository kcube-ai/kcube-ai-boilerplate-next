from pydantic import BaseModel


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str


class ResetPasswordRequest(BaseModel):
    email: str


class ResetPassword(BaseModel):
    password: str
