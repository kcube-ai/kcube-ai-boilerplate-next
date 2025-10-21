from fastapi import APIRouter, Depends, HTTPException, Request, Response, Query, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.config import settings
from app.core.database import get_db
from app.models import Users
from app.schemas.users import UserCreate, UserLogin
from app.schemas.auth import TokenPair, ResetPasswordRequest, ResetPassword
from app.core.security import get_password_hash, verify_password, create_token_pair, decode_token, create_verification_token
from app.email.utils import send_verification_email, send_pw_reset_email

router = APIRouter()


@router.post("/auth/login", response_model=TokenPair)
def login_user(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(Users).filter(
        Users.email == user_data.email).first()
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(user_data.password, existing_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate token pair
    token_pair = create_token_pair(existing_user)

    # Set refresh token in secure, HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=token_pair.refresh_token,
        httponly=True,
        # secure=True,           # True if using HTTPS
        # samesite="lax",        # or "strict" depending on your needs
        max_age=60 * 60 * 24 * 7,  # expires in 7 days
        # path="/api/auth/refresh"   # optional: limit cookie scope
    )

    return token_pair


@router.get("/auth/refresh")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    payload = decode_token(refresh_token)

    # Verify that the user still exists and is active
    user = db.query(Users).filter(Users.id == payload["id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Generate new token pair
    token_pair = create_token_pair(user)

    # Update refresh cookie
    response.set_cookie(
        key="refresh_token",
        value=token_pair.refresh_token,
        httponly=True,
        # secure=True,  # enable in production
        # samesite="lax",
        max_age=60 * 60 * 24 * 7
    )

    return token_pair


@router.post("/auth/register")
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(Users).filter(
        Users.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash Password
    hashed_password = get_password_hash(user_data.password)

    # Create user instance
    new_user = Users(
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        password_hash=hashed_password
    )

    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    verify_token = create_verification_token(new_user.email)
    verify_url = f"{
        settings.BASE_URL}/api/auth/verify-email?token={verify_token}"

    await send_verification_email(new_user.email, verify_url)

    # Return registered user
    return {
        "id": str(new_user.id),
        "email": new_user.email,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "message": "User registered successfully. A verification link has been sent to your email address."
    }


@router.get("/auth/verify-email")
def verify_email(token: str = Query(...), db: Session = Depends(get_db)):
    # Decode the token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    user_email = payload.get("email")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload"
        )

    # Fetch user from DB
    user = db.query(Users).filter(Users.email == user_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if already verified
    if user.is_verified:
        return {"message": "Email already verified."}

    # Mark as verified
    user.is_verified = True
    db.commit()

    # Respond (your frontend can redirect from here)
    return {"message": "Email successfully verified."}


@router.post("/auth/request-password-reset")
async def request_password_reset(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Check if email was sent in request
    if not data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bad Request: Email not specified"
        )

    # Check if user exists
    user = db.query(Users).filter(Users.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    token = create_verification_token(user.email)
    reset_url = f"{settings.BASE_URL}/reset-password?token={token}"
    await send_pw_reset_email(user.email, reset_url)

    return {"message": "password reset link has been sent to your email"}


@router.post("/auth/reset-password")
def reset_password(data: ResetPassword, token: str = Query(...), db: Session = Depends(get_db)):
    # Decode the token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    # Check if request sent an email
    user_email = payload.get("email")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload"
        )

    # Fetch user from DB
    user = db.query(Users).filter(Users.email == user_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    hashed_password = get_password_hash(data.password)

    # Update user password
    user.password_hash = hashed_password

    db.add(user)
    db.commit()

    return {"message": "Password has been reset successfully."}
