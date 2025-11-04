"""Message module exceptions."""

from backend.core.exceptions import AppException


class MessageNotFound(AppException):
    """Exception raised when a message is not found."""

    MESSAGE = "Message not found"

    def __init__(self, message_id: str | None = None):
        message = (
            f"Message with ID '{message_id}' not found" if message_id else self.MESSAGE
        )
        super().__init__(message, status_code=404)


class EmptyMessageContent(AppException):
    """Exception raised when message content is empty."""

    MESSAGE = "Message content cannot be empty"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=400)
