from fastapi import APIRouter, HTTPException, Request, Response, Depends, status
from sqlalchemy.orm import Session
from uuid import uuid4

# from app.core.config import settings
from app.core.security import create_token_pair
from app.core.database import get_db
from app.oauth.config import oauth
from app.models.users import Users

router = APIRouter()


@router.get('/oauth/google/login')
async def google_login(request: Request):
    redirect_uri = request.url_for('google_auth')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get('/oauth/google/auth')
async def google_auth(request: Request, response: Response, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get('userinfo')

    print(user_info)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to fetch user info from Google"
        )

    email = user_info.get("email")
    first_name = user_info.get("given_name") or ""
    last_name = user_info.get("family_name") or ""

    if not email:
        raise HTTPException(
            status_code=400, detail="Email not provided by Google")

    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email == email).first()

    if not existing_user:
        # Create a new user entry for Google user
        new_user = Users(
            id=uuid4(),
            email=email,
            first_name=first_name,
            last_name=last_name,
            password_hash="",  # not used for Google accounts
            bio="",
            role="user",
            is_verified=True,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user
    else:
        user = existing_user

    # Generate tokens (reuse your existing local auth logic)
    token_pair = create_token_pair(user)

    # Set refresh token in secure, HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=token_pair.refresh_token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,  # 7 days
        # secure=True,  # enable in production (HTTPS)
        # samesite="lax",
    )

    # Return access token or redirect to frontend
    # You can return JSON if you have no frontend redirect yet
    return token_pair
