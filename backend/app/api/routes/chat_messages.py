from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chat_messages import ChatMessages
from app.models.conversations import Conversations
from app.schemas.chat_messages import ChatMessageCreate, ChatMessageData
from app.dependencies.auth import auth_dependency
from app.schemas.auth import TokenPayload

router = APIRouter()


@router.get("/chat-messages/{conversation_id}", response_model=list[ChatMessageData])
def get_all_chat_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Get all chat messages belonging to the specified conversation
    owned by the authenticated user.
    """
    # Verify the conversation belongs to the authenticated user
    conversation = (
        db.query(Conversations)
        .filter(Conversations.id == conversation_id, Conversations.user_id == payload.id)
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or does not belong to the user"
        )

    # Fetch messages for that conversation
    messages = (
        db.query(ChatMessages)
        .filter(ChatMessages.conversation_id == conversation_id)
        .order_by(ChatMessages.created_at.asc())
        .all()
    )

    return messages


@router.post("/chat-messages", response_model=ChatMessageData, status_code=status.HTTP_201_CREATED)
def create_chat_message(
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Create a new chat message for a conversation that belongs to the authenticated user.
    """
    # Validate that conversation belongs to the user
    conversation = (
        db.query(Conversations)
        .filter(
            Conversations.id == data.conversation_id,
            Conversations.user_id == payload.id
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied"
        )

    # Create new chat message
    new_message = ChatMessages(
        conversation_id=data.conversation_id,
        role=data.role,
        content=data.content,
        tokens_used=data.tokens_used or 0
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return ChatMessageData(
        id=str(new_message.id),
        conversation_id=str(new_message.conversation_id),
        role=new_message.role,
        content=new_message.content,
        tokens_used=new_message.tokens_used,
        created_at=new_message.created_at
    )


@router.delete("/chat-messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat_message(
    message_id: str,
    db: Session = Depends(get_db),
    payload: TokenPayload = Depends(auth_dependency)
):
    """
    Delete a chat message if it belongs to one of the authenticated user's conversations.
    """
    message = (
        db.query(ChatMessages)
        .join(Conversations, ChatMessages.conversation_id == Conversations.id)
        .filter(
            ChatMessages.id == message_id,
            Conversations.user_id == payload.id
        )
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat message not found"
        )

    db.delete(message)
    db.commit()

    # Return 204 No Content
    return
