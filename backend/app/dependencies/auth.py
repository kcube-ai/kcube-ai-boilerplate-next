from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import RedirectResponse

from app.core.security import decode_token, create_verification_token

app = FastAPI()


def auth_dependency(request: Request):
    # Extract Authorization header
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Invalid or Missing authorization header"
        )

    # Extract token from header
    token = auth_header.split("Bearer ")[1]

    # Decode the token
    payload = decode_token(token)

    # Exception on no payload
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Invalid or Expired token"
        )

    if not payload.is_verified:
        raise HTTPException(
            status_code=status.HTTP_428_PRECONDITION_REQUIRED,
            detail="Email not verified"
        )

    return payload
