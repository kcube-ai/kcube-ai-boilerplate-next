from fastapi import APIRouter, HTTPException, Request, Response, Depends, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from uuid import uuid4

# from app.core.config import settings
from app.core.security import create_token_pair
from app.core.database import get_db
from app.oauth.config import oauth
from app.models.users import Users

router = APIRouter()
frontend_redirect_url = "http://localhost:5173/oauth/success"


@router.get('/oauth/google/login')
async def google_login(request: Request):
    redirect_uri = request.url_for('google_auth')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get('/oauth/microsoft/login')
async def microsoft_login(request: Request):
    redirect_uri = request.url_for('microsoft_auth')
    return await oauth.microsoft.authorize_redirect(request, redirect_uri)


@router.get('/oauth/meta/login')
async def meta(request: Request):
    redirect_uri = request.url_for('meta_auth')
    return await oauth.meta.authorize_redirect(request, redirect_uri)


@router.get('/oauth/google/auth')
async def google_auth(request: Request, response: Response, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get('userinfo')

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

    redirect_url = f"{frontend_redirect_url}?access_token={
        token_pair.access_token}&refresh_token={token_pair.refresh_token}"
    # Return access token or redirect to frontend
    # You can return JSON if you have no frontend redirect yet
    return RedirectResponse(url=redirect_url)


@router.get('/oauth/microsoft/auth')
async def microsoft_auth(request: Request, response: Response, db: Session = Depends(get_db)):
    microsoft = oauth.create_client('microsoft')
    token = await microsoft.authorize_access_token(request)
    user_info = token.get('userinfo')

    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to fetch user info from Microsoft"
        )

    email = user_info.get("email")
    first_name = user_info.get("given_name") or ""
    last_name = user_info.get("family_name") or ""

    if not email:
        raise HTTPException(
            status_code=400, detail="Email not provided by Microsoft")

    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email == email).first()

    if not existing_user:
        # Create a new user entry for Microsoft user
        new_user = Users(
            id=uuid4(),
            email=email,
            first_name=first_name,
            last_name=last_name,
            password_hash="",  # not used for Microsoft accounts
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

    redirect_url = f"{frontend_redirect_url}?access_token={
        token_pair.access_token}&refresh_token={token_pair.refresh_token}"
    # Return access token or redirect to frontend
    # You can return JSON if you have no frontend redirect yet
    return RedirectResponse(url=redirect_url)
