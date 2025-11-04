"""
OpenAI service for Azure OpenAI integration.
Provides embedding generation and other AI-powered functionality using Azure OpenAI.
"""

from typing import List

from openai import AzureOpenAI

from backend.core.config import settings

L2_DISTANCE_THRESHOLD = 1.2


class OpenAIService:
    """Service class for Azure OpenAI operations."""

    def __init__(self):
        """Initialize Azure OpenAI client."""
        self.client = AzureOpenAI(
            api_key=settings.AZURE_OPENAI_API_KEY,
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_version=settings.AZURE_OPENAI_VERSION,
        )
        self.default_chat_model = settings.AZURE_OPENAI_CHAT_MODEL

    def generate_embedding_large(self, text: str) -> List[float]:
        """Generate text embeddings using text-embedding-3-large model."""
        response = self.client.embeddings.create(
            model="text-embedding-3-large", input=text
        )
        return response.data[0].embedding

    def chat(
        self, messages: List[dict], temperature: float = 0.7, model: str = None
    ) -> str:
        """Generate chat completion response using Azure OpenAI."""
        response = self.client.chat.completions.create(
            model=model or self.default_chat_model,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message.content


# Global singleton instance
openai_service = OpenAIService()
