"""Service layer for Xero organization business logic."""

from typing import List
from uuid import UUID

from sqlmodel import Session

from backend.models import XeroOrganization, XeroOrganizationStatus

from .db import xero_organization_db
from .exceptions import XeroOrganizationNotFound
from .lib import XeroConnectionInfo


class XeroOrganizationService:
    """Service for Xero organization business logic."""

    def save_new(
        self, session: Session, user_id: UUID, connections: List[XeroConnectionInfo]
    ) -> List[XeroConnectionInfo]:
        """Save new Xero organizations from connection info."""
        new_organizations = []
        for connection in connections:
            # Check if organization already exists
            existing_org = xero_organization_db.get_by_connection_id(
                session, connection.connection_id
            )
            if not existing_org:
                # Create new
                xero_organization_db.create(
                    session=session,
                    user_id=user_id,
                    name=connection.name,
                    tenant_id=connection.tenant_id,
                    connection_id=connection.connection_id,
                )
                new_organizations.append(connection)

        return new_organizations

    def get_by_user_id(self, session: Session, user_id: UUID) -> List[XeroOrganization]:
        """Get all organizations for a user."""
        return xero_organization_db.get_by_user_id(session, user_id)

    def update_status(
        self, session: Session, organization_id: UUID, status: XeroOrganizationStatus
    ) -> None:
        """Update organization status."""
        org = xero_organization_db.get(session, organization_id)
        if not org:
            raise XeroOrganizationNotFound(organization_id=str(organization_id))

        # Update
        xero_organization_db.update_status(session, org, status)

    def delete(self, session: Session, organization_id: UUID) -> None:
        """Delete organization."""
        org = xero_organization_db.get(session, organization_id)
        if not org:
            raise XeroOrganizationNotFound(organization_id=str(organization_id))

        # Delete
        xero_organization_db.delete(session, org)


# Global service instance
xero_organization_service = XeroOrganizationService()
