"""
Xero organization module specific exceptions.
All exceptions related to Xero organization management.
"""

from backend.core.exceptions import AppException


class XeroOrganizationNotFound(AppException):
    """Raised when a Xero organization cannot be found."""

    MESSAGE = "Xero organization not found"

    def __init__(self, organization_id: str | None = None):
        message = (
            f"Xero organization with ID '{organization_id}' not found"
            if organization_id
            else self.MESSAGE
        )
        super().__init__(message, status_code=404)
