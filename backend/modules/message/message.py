"""Message service layer with RAG implementation."""

from uuid import UUID

from sqlalchemy.orm.attributes import flag_modified
from sqlmodel import Session

from backend.models import Chat, Message, MessageRole
from backend.modules.knowledge.knowledge import FullDocument, knowledge_service
from backend.services.openai import L2_DISTANCE_THRESHOLD, openai_service

from .db import message_db
from .exceptions import EmptyMessageContent


class MessageService:
    """Service class for message business logic with RAG."""

    def create(
        self,
        session: Session,
        chat_id: UUID,
        content: str,
        role: MessageRole = MessageRole.USER,
    ) -> Message:
        """Create a user message."""
        if not content or not content.strip():
            raise EmptyMessageContent()

        return message_db.create(
            session=session,
            chat_id=chat_id,
            role=role,
            content=content.strip(),
        )

    def get_answer(
        self,
        session: Session,
        chat: Chat,
        ai_message: Message,
        user_message: str,
        user_id: UUID,
    ) -> None:
        """Generate AI response using RAG with chat history and incremental debug traces."""
        # Initialize pipeline metadata
        ai_message.meta_data = {"pipeline": []}

        # Track query received
        ai_message.meta_data["pipeline"].append(
            {
                "name": "query_received",
                "display_name": "Query Received",
                "input": {"query_length": len(user_message)},
                "output": {"status": "ready_for_processing"},
            }
        )
        flag_modified(ai_message, "meta_data")
        session.add(ai_message)
        session.flush()

        # Generate embedding vector from query
        query_embedding = openai_service.generate_embedding_large(user_message)

        ai_message.meta_data["pipeline"].append(
            {
                "name": "embedding_generation",
                "display_name": "Embedding Generation",
                "input": {"query_length": len(user_message)},
                "output": {
                    "embedding_dimensions": len(query_embedding),
                    "model": "text-embedding-3-large",
                    "status": "embedding_created",
                },
            }
        )
        flag_modified(ai_message, "meta_data")
        session.add(ai_message)
        session.flush()

        # Retrieve full documents from similar chunks
        full_documents = knowledge_service.get_full_documents_from_similar(
            session=session,
            user_id=user_id,
            query_embedding=query_embedding,
            distance_threshold=L2_DISTANCE_THRESHOLD,
            limit=5,
        )

        ai_message.meta_data["pipeline"].append(
            {
                "name": "document_retrieval",
                "display_name": "Document Retrieval",
                "input": {
                    "embedding_dimensions": len(query_embedding),
                    "distance_threshold": L2_DISTANCE_THRESHOLD,
                    "limit": 5,
                },
                "output": {
                    "documents_found": len(full_documents),
                    "documents": [
                        {
                            "id": str(doc.source_id),
                            "filename": doc.meta_data.get("filename", "Unknown"),
                            "relevance_score": float(doc.relevance_score),
                            "content_length": len(doc.content),
                        }
                        for doc in full_documents
                    ],
                },
            }
        )
        flag_modified(ai_message, "meta_data")
        session.add(ai_message)
        session.flush()

        # Build context from retrieved documents
        context_parts = []
        for doc in full_documents:
            context_parts.append(
                f"[Relevance Score: {doc.relevance_score:.3f}]\n"
                f"Document: {doc.meta_data.get('filename', 'Unknown')}\n\n"
                f"{doc.content}"
            )

        context = (
            "\n\n---\n\n".join(context_parts)
            if context_parts
            else "No relevant documents found."
        )

        ai_message.meta_data["pipeline"].append(
            {
                "name": "context_assembly",
                "display_name": "Context Assembly",
                "input": {"documents_count": len(full_documents)},
                "output": {
                    "context_length": len(context),
                    "documents_used": len(full_documents),
                    "status": "context_ready",
                },
            }
        )
        flag_modified(ai_message, "meta_data")
        session.add(ai_message)
        session.flush()

        # Prepare messages with system prompt, context, and chat history
        system_prompt = """You are a helpful AI assistant. Use the provided context from the user's documents to answer their questions.
If the context doesn't contain relevant information, say so and provide a general response.
Always be concise and accurate."""

        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "system",
                "content": f"Context from user's documents:\n\n{context}",
            },
        ]

        # Include conversation history
        messages += [
            {"role": msg.role.value.lower(), "content": msg.content}
            for msg in chat.messages
            if msg.id != ai_message.id and msg.role != MessageRole.SYSTEM
        ]

        # Generate AI response
        ai_response = openai_service.chat(messages=messages)

        # Update message content and trace
        ai_message.content = ai_response

        ai_message.meta_data["pipeline"].append(
            {
                "name": "ai_generation",
                "display_name": "AI Generation",
                "input": {
                    "context_length": len(context),
                    "history_messages_count": len(messages),
                    "model": "gpt-4o",
                },
                "output": {
                    "response_length": len(ai_response),
                    "status": "response_generated",
                },
            }
        )
        flag_modified(ai_message, "meta_data")
        session.add(ai_message)
        session.flush()


message_service = MessageService()
