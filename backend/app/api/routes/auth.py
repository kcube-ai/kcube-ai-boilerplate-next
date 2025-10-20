from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Users
from app.schemas.users import UserCreate, UserLogin
from app.schemas.auth import TokenPair
from app.core.security import get_password_hash, verify_password, create_token_pair, decode_token

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
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
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

    # Return registered user
    return {
        "id": str(new_user.id),
        "email": new_user.email,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "message": "User registered successfully"
    }
