from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Users
from app.schemas.users import UserData, UserEditRequest, UserEditResponse
from app.schemas.auth import TokenPayload

from app.dependencies.auth import auth_dependency

router = APIRouter()


@router.get("/users/me", response_model=UserData)
def get_user(db: Session = Depends(get_db), payload: TokenPayload = Depends(auth_dependency)):
    # Fetch the user record
    user = db.query(Users).filter(Users.id == payload.id).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserData(
        id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        bio=user.bio,
        role=user.role,
        updated_at=str(user.updated_at),
        created_at=str(user.created_at)
    )


@router.put("/users/me", response_model=UserEditResponse)
def edit_user(
    data: UserEditRequest,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    # Fetch the user record
    user = db.query(Users).filter(Users.id == payload.id).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

    # Update editable fields
    user.first_name = data.first_name
    user.last_name = data.last_name
    user.bio = data.bio

    db.commit()
    db.refresh(user)

    return UserEditResponse(
        message="User updated successfully",
        user=UserData(
            id=str(user.id),
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            bio=user.bio,
            role=user.role,
            updated_at=str(user.updated_at),
            created_at=str(user.created_at)
        )
    )


@router.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_user(
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    user_id = payload.id

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}
