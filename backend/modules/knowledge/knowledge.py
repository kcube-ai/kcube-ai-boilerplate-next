"""
Knowledge service layer for managing document chunks and embeddings.
"""

from dataclasses import dataclass
from typing import Dict, List
from uuid import UUID

from sqlmodel import Session

from backend.models import Knowledge

from .db import knowledge_db


@dataclass
class FullDocument:
    """Reconstructed full document from chunks."""

    source_id: UUID
    content: str
    meta_data: Dict
    relevance_score: float


class KnowledgeService:
    """Service class for managing and manipulating knowledge data."""

    def create(
        self,
        session: Session,
        source_id: UUID,
        content: str,
        meta_data: Dict,
        chunk_number: int,
        embedding: List,
        user_id: UUID,
    ) -> None:
        """Create a knowledge chunk with embedding."""
        knowledge_db.create(
            session=session,
            source_id=source_id,
            content=content,
            chunk_number=chunk_number,
            meta_data=meta_data,
            embedding=embedding,
            user_id=user_id,
        )

    def get_similar(
        self,
        session: Session,
        user_id: UUID,
        query_embedding: List[float],
        distance_threshold: float = 1.2,
        limit: int = 5,
    ) -> List[tuple[Knowledge, float]]:
        """Search for similar knowledge chunks using L2 distance."""
        return knowledge_db.get_similar(
            session=session,
            user_id=user_id,
            query_embedding=query_embedding,
            distance_threshold=distance_threshold,
            limit=limit,
        )

    def get_full_documents_from_similar(
        self,
        session: Session,
        user_id: UUID,
        query_embedding: List[float],
        distance_threshold: float = 1.2,
        limit: int = 5,
    ) -> List[FullDocument]:
        """
        Get full documents from top similar chunks.

        Returns unique full documents whose chunks matched the query,
        with the best relevance score for each document.
        """
        # Get top similar chunks
        similar_chunks = self.get_similar(
            session=session,
            user_id=user_id,
            query_embedding=query_embedding,
            distance_threshold=distance_threshold,
            limit=limit,
        )
        if not similar_chunks:
            return []

        # Extract unique source IDs and track best relevance score per document
        source_scores = {}
        for chunk, score in similar_chunks:
            if chunk.source_id not in source_scores:
                source_scores[chunk.source_id] = score
            else:
                # Keep the best (lowest) score
                source_scores[chunk.source_id] = min(
                    source_scores[chunk.source_id], score
                )

        source_ids = list(source_scores.keys())

        # Get all chunks for these documents
        all_chunks = knowledge_db.get_all_by_source_ids(
            session=session, source_ids=source_ids, user_id=user_id
        )

        # Group chunks by source_id and reconstruct documents
        documents_by_source = {}
        for chunk in all_chunks:
            if chunk.source_id not in documents_by_source:
                documents_by_source[chunk.source_id] = {
                    "chunks": [],
                    "meta_data": chunk.meta_data,
                }
            documents_by_source[chunk.source_id]["chunks"].append(chunk.content)

        # Create FullDocument objects
        full_documents = []
        for source_id, data in documents_by_source.items():
            full_content = "\n\n".join(data["chunks"])
            full_documents.append(
                FullDocument(
                    source_id=source_id,
                    content=full_content,
                    meta_data=data["meta_data"],
                    relevance_score=source_scores[source_id],
                )
            )

        # Sort by relevance score (lower is better)
        full_documents.sort(key=lambda x: x.relevance_score)

        return full_documents

    def delete_by_source_id(
        self, session: Session, source_id: UUID, user_id: UUID
    ) -> None:
        """Delete all knowledge chunks by source document ID."""
        knowledge_db.delete_by_source_id(session, source_id, user_id=user_id)


knowledge_service = KnowledgeService()
