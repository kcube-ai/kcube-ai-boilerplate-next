"""Chat module exceptions."""

from uuid import UUID

from backend.core.exceptions import AppException


class ChatNotFound(AppException):
    """Exception raised when a chat is not found."""

    MESSAGE = "Chat not found"

    def __init__(self, chat_id: UUID | None = None):
        message = (
            f"Chat with ID '{str(chat_id)}' not found" if chat_id else self.MESSAGE
        )
        super().__init__(message, status_code=404)
