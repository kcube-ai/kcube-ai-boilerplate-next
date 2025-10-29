from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.conversations import Conversations
from app.schemas.conversations import ConversationData
from app.dependencies.auth import auth_dependency
from app.schemas.auth import TokenPayload

router = APIRouter()


@router.get("/conversations", response_model=list[ConversationData])
def get_all_conversations(
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Get all conversations belonging to the authenticated user.
    """
    conversations: ConversationData = (
        db.query(Conversations)
        .filter(Conversations.user_id == payload.id)
        .order_by(Conversations.created_at.desc())
        .all()
    )

    return conversations


@router.get("/{conversation_id}", response_model=ConversationData)
def get_single_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Get a single conversation if it belongs to the authenticated user.
    """
    conversation = (
        db.query(Conversations)
        .filter(
            Conversations.id == conversation_id,
            Conversations.user_id == payload.id
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    return ConversationData(
        id=str(conversation.id),
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at
    )
