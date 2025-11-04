"""
Text chunking service for splitting document content into optimal chunks.
Implements intelligent strategies for page-based and character-based chunking with overlap.
"""

from typing import List

from backend.lib.file import file_service


class TextChunkerService:
    """Service for splitting text content into chunks optimized for embeddings."""

    # Character limits for chunking
    MAX_CHUNK_SIZE = 4000
    MIN_CHUNK_SIZE = 500
    CHUNK_OVERLAP = 200

    def __init__(self):
        """Initialize text chunker with file service dependency."""

        self.file_service = file_service

    def chunk_text(self, text_content: str) -> List[str]:
        """Split text into chunks using page markers or character-based strategy with overlap."""
        if not text_content or not text_content.strip():
            return []

        # Try page-based splitting first (works for PDF, PPTX, PPT, XLSX, XLS)
        if "♀" in text_content or "\f" in text_content:
            chunks = self._split_by_pages(text_content)
        else:
            # Fallback to character-based splitting (for TXT and unsplit content)
            chunks = self._split_by_characters(text_content)

        # Post-process: split oversized chunks and remove empty ones
        final_chunks = []
        for chunk in chunks:
            if len(chunk) > self.MAX_CHUNK_SIZE:
                # Split large chunks further
                final_chunks.extend(self._split_by_characters(chunk))
            elif len(chunk) >= self.MIN_CHUNK_SIZE:
                final_chunks.append(chunk)
            elif chunk.strip():  # Keep small non-empty chunks
                final_chunks.append(chunk)

        return [c.strip() for c in final_chunks if c.strip()]

    def _split_by_pages(self, text_content: str) -> List[str]:
        """Split text by page markers."""
        if "♀" in text_content:
            pages = text_content.split("♀")
        elif "\f" in text_content:
            pages = text_content.split("\f")
        else:
            pages = [text_content]

        return [p.strip() for p in pages if p.strip()]

    def _split_by_characters(self, text_content: str) -> List[str]:
        """Split text by character limit with overlap for context continuity."""
        if len(text_content) <= self.MAX_CHUNK_SIZE:
            return [text_content]

        chunks = []
        start = 0
        text_length = len(text_content)

        while start < text_length:
            # Calculate end position
            end = start + self.MAX_CHUNK_SIZE

            # If this is not the last chunk, try to break at a sentence or word boundary
            if end < text_length:
                # Try to find a sentence boundary (. ! ?)
                sentence_end = self._find_sentence_boundary(
                    text_content, start, end, text_length
                )
                if sentence_end > start:
                    end = sentence_end
                else:
                    # Fallback: find word boundary (space)
                    word_end = self._find_word_boundary(text_content, start, end)
                    if word_end > start:
                        end = word_end

            # Extract chunk
            chunk = text_content[start:end].strip()
            if chunk:
                chunks.append(chunk)

            # Move start position with overlap for next chunk
            start = max(start + 1, end - self.CHUNK_OVERLAP)

        return chunks

    def _find_sentence_boundary(
        self, text: str, start: int, preferred_end: int, text_length: int
    ) -> int:
        """Find the nearest sentence boundary near the preferred end."""
        # Look backward from preferred_end for sentence endings
        search_start = max(start, preferred_end - 200)  # Search within 200 chars
        substring = text[search_start:preferred_end]

        # Find last occurrence of sentence endings
        for char in [".", "!", "?"]:
            last_pos = substring.rfind(char)
            if last_pos != -1:
                # Return position after the punctuation and any following whitespace
                actual_pos = search_start + last_pos + 1
                while actual_pos < text_length and text[actual_pos].isspace():
                    actual_pos += 1
                return actual_pos

        return -1

    def _find_word_boundary(self, text: str, start: int, preferred_end: int) -> int:
        """Find the nearest word boundary (space) near the preferred end."""
        # Look backward from preferred_end for spaces
        search_start = max(start, preferred_end - 100)  # Search within 100 chars
        substring = text[search_start:preferred_end]

        last_space = substring.rfind(" ")
        if last_space != -1:
            return search_start + last_space + 1

        return -1


text_chunk_service = TextChunkerService()
