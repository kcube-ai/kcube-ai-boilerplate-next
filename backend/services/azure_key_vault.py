"""Azure Key Vault service for managing secrets."""

from typing import Optional

from azure.core.exceptions import ResourceNotFoundError
from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient

from backend.core.config import settings


class AzureKeyVaultService:
    """Azure Key Vault client for secret management."""

    def __init__(self):
        """Initialize and connect to Azure Key Vault."""
        self._client = SecretClient(
            vault_url=settings.AZURE_KEY_VAULT_URL,
            credential=ClientSecretCredential(
                tenant_id=settings.AZURE_KEY_VAULT_TENANT_ID,
                client_id=settings.AZURE_KEY_VAULT_CLIENT_ID,
                client_secret=settings.AZURE_KEY_VAULT_CLIENT_SECRET,
            ),
        )

    def get_secret(self, name: str) -> Optional[str]:
        """Get secret value by name, returns None if not found."""
        try:
            secret = self._client.get_secret(name)
            return secret.value
        except ResourceNotFoundError:
            return None

    def set_secret(self, name: str, value: str) -> None:
        """Store or update secret in Key Vault."""
        self._client.set_secret(name, value)

    def delete_secret(self, name: str, purge: bool = False) -> bool:
        """Delete secret, returns False if not found."""
        try:
            poller = self._client.begin_delete_secret(name)
            poller.result()
            if purge:
                self._client.purge_deleted_secret(name)
            return True
        except ResourceNotFoundError:
            return False


# Global instance for application-wide use
azure_key_vault_service = AzureKeyVaultService()
