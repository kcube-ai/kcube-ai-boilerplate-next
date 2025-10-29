from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.conversations import Conversations
from app.schemas.conversations import ConversationData, ConversationCreate, ConversationUpdate
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


@router.get("/conversations/{conversation_id}", response_model=ConversationData)
def get_single_conversation(
    conversation_id,
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


@router.post("/conversations", response_model=ConversationData, status_code=status.HTTP_201_CREATED)
def create_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Create a new conversation for the authenticated user.
    """
    new_conversation = Conversations(
        user_id=payload.id,
        title=data.title
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return ConversationData(
        id=str(new_conversation.id),
        title=new_conversation.title,
        created_at=new_conversation.created_at,
        updated_at=new_conversation.updated_at
    )


@router.put("/conversations/{conversation_id}", response_model=ConversationData)
def update_conversation_title(
    conversation_id: str,
    data: ConversationUpdate,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Update only the title of a conversation belonging to the authenticated user.
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

    # Update only the title
    conversation.title = data.title
    db.commit()
    db.refresh(conversation)

    return ConversationData(
        id=str(conversation.id),
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at
    )


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Delete a conversation belonging to the authenticated user.
    Automatically cascades to delete related chat messages.
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

    db.delete(conversation)
    db.commit()

    # Return 204 No Content (empty response body)
    return
