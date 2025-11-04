"""Data access layer for Xero organization operations."""

from typing import List, Optional
from uuid import UUID

from sqlmodel import Session, select

from backend.models import XeroOrganization, XeroOrganizationStatus


class XeroOrganizationDB:
    """Repository for Xero organization database operations."""

    def get(
        self, session: Session, organization_id: UUID
    ) -> Optional[XeroOrganization]:
        """Get organization by ID."""
        statement = select(XeroOrganization).where(
            XeroOrganization.id == organization_id
        )
        return session.exec(statement).first()

    def get_by_connection_id(
        self, session: Session, connection_id: str
    ) -> Optional[XeroOrganization]:
        """Get organization by Xero connection ID."""
        statement = select(XeroOrganization).where(
            XeroOrganization.connection_id == connection_id
        )
        return session.exec(statement).first()

    def get_by_user_id(self, session: Session, user_id: UUID) -> List[XeroOrganization]:
        """Get all organizations for a user."""
        statement = select(XeroOrganization).where(XeroOrganization.user_id == user_id)
        return list(session.exec(statement).all())

    def create(
        self,
        session: Session,
        connection_id: str,
        name: str,
        tenant_id: str,
        user_id: UUID,
        status: XeroOrganizationStatus = XeroOrganizationStatus.PENDING,
    ) -> XeroOrganization:
        """Create a new Xero organization record."""
        organization = XeroOrganization(
            connection_id=connection_id,
            name=name,
            tenant_id=tenant_id,
            user_id=user_id,
            status=status,
        )
        session.add(organization)
        session.flush()
        return organization

    def update_status(
        self, session: Session, org: XeroOrganization, status: XeroOrganizationStatus
    ) -> None:
        """Update organization status."""
        org.status = status
        session.add(org)
        session.flush()

    def delete(self, session: Session, org: XeroOrganization) -> None:
        """Delete organization by ID."""
        session.delete(org)


# Global instance
xero_organization_db = XeroOrganizationDB()
