import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.auth import TokenPair
from app.models.users import Users


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')  # store as string in DB


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def _create_access_token(user_data: dict, minutes):
    payload = {
        "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes),
        "id": user_data["id"],
        "email": user_data["email"],
        "role": user_data["role"]
    }

    access_token = jwt.encode(
        payload, settings.TOKEN_SECRET, algorithm="HS256")

    return access_token


def _create_refresh_token(user_data: dict, minutes):
    payload = {
        "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes),
        "id": user_data["id"],
        "email": user_data["email"],
        "role": user_data["role"]
    }

    token = jwt.encode(
        payload, settings.TOKEN_SECRET, algorithm="HS256")

    return token


def create_token_pair(user: Users) -> TokenPair:
    payload = {
        "id": str(user.id),
        "email": user.email,
        "role": user.role
    }

    return TokenPair(
        access_token=_create_refresh_token(
            payload, settings.ACCESS_TOKEN_EXPIRE),
        refresh_token=_create_refresh_token(
            payload, settings.REFRESH_TOKEN_EXPIRE)
    )


def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.TOKEN_SECRET, algorithms="HS256")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
