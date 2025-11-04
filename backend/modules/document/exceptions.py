"""
Document module specific exceptions.
All exceptions related to Document functionality.
"""

from backend.core.exceptions import AppException


class UnSupportedFileType(AppException):
    """Raised when file extension is not supported."""

    MESSAGE = "Unsupported file extension"

    def __init__(self, extension: str):
        super().__init__(f"{self.MESSAGE}: .{extension}", status_code=400)


class DocumentNotFound(AppException):
    """Raised when document is not found."""

    MESSAGE = "Document not found"

    def __init__(self):
        super().__init__(self.MESSAGE, status_code=404)


class MaxDocumentsExceeded(AppException):
    """Raised when user exceeds maximum document limit."""

    MESSAGE = "Maximum document limit exceeded"

    def __init__(self, max_limit: int):
        super().__init__(
            f"{self.MESSAGE}. You can upload a maximum of {max_limit} documents.",
            status_code=400,
        )
