"""
Knowledge database manipulation.
"""

from typing import Dict, List
from uuid import UUID

from sqlalchemy import delete, select
from sqlmodel import Session

from backend.models import Knowledge


class KnowledgeDB:
    """Class for managing knowledge database operations."""

    def create(
        self,
        session: Session,
        source_id: UUID,
        content: str,
        chunk_number: int,
        meta_data: Dict,
        embedding: List,
        user_id: UUID,
    ) -> Knowledge:
        """Create a knowledge chunk."""
        knowledge = Knowledge(
            source_id=source_id,
            chunk_number=chunk_number,
            content=content,
            user_id=user_id,
            embedding=embedding,
            meta_data=meta_data,
        )
        session.add(knowledge)
        session.flush()
        return knowledge

    def get(self, session: Session, id: UUID) -> Knowledge | None:
        """Get a knowledge chunk by ID."""
        stmt = select(Knowledge).where(Knowledge.id == id)
        return session.scalar(stmt)

    def get_similar(
        self,
        session: Session,
        user_id: UUID,
        query_embedding: List[float],
        distance_threshold: float = 1.2,
        limit: int = 5,
    ) -> List[tuple[Knowledge, float]]:
        """
        Search for similar knowledge chunks using L2 distance.
        Returns list of (knowledge, distance_score) tuples where lower scores are better.
        """
        distance = Knowledge.embedding.l2_distance(query_embedding)
        stmt = (
            select(Knowledge, distance.label("score"))
            .where(Knowledge.user_id == user_id)
            .where(distance <= distance_threshold)
            .order_by(distance)
            .limit(limit)
        )

        results = session.exec(stmt).all()
        return [(knowledge, score) for knowledge, score in results]

    def get_all_by_source_ids(
        self, session: Session, source_ids: List[UUID], user_id: UUID
    ) -> List[Knowledge]:
        """Get all chunks for given source document IDs, ordered by chunk_number."""
        stmt = (
            select(Knowledge)
            .where(Knowledge.source_id.in_(source_ids))
            .where(Knowledge.user_id == user_id)
            .order_by(Knowledge.source_id, Knowledge.chunk_number)
        )
        return list(session.exec(stmt).all())

    def delete_by_source_id(
        self, session: Session, source_id: UUID, user_id: UUID
    ) -> None:
        """Delete all knowledge chunks by source document ID."""
        stmt = delete(Knowledge).where(
            Knowledge.source_id == source_id, Knowledge.user_id == user_id
        )
        session.exec(stmt)
        session.flush()


knowledge_db = KnowledgeDB()
