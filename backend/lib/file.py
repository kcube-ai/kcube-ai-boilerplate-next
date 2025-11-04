"""
File conversion service using MarkItDown library.
"""

import io
import re

from markitdown import MarkItDown
from markitdown._stream_info import StreamInfo

md = MarkItDown()


SUPPORTED_FILE_EXTENSIONS = [".pdf", ".xlsx", ".xls", ".pptx", ".ppt", ".txt"]


class FileService:
    """Extract text from files and convert to markdown."""

    def is_supported(self, filename: str) -> bool:
        """Check if the given file extension is supported by MarkItDown."""
        ext = self.get_extension(filename=filename)
        if not ext:
            return False
        return f".{ext}" in SUPPORTED_FILE_EXTENSIONS

    def get_extension(self, filename: str) -> str:
        """Get the file extension from the filename."""
        if "." in filename:
            return filename.split(".")[-1].lower()
        return ""

    def convert_to_markdown(
        self, file_content: bytes, mimetype: str, filename: str, sanitize: bool = True
    ) -> str:
        """Convert file content to markdown text."""
        file_stream = io.BytesIO(file_content)
        extension = self.get_extension(filename=filename)
        stream_info = StreamInfo(
            filename=filename, mimetype=mimetype, extension=f".{extension}"
        )
        result = md.convert_stream(stream=file_stream, stream_info=stream_info)
        text_content = result.text_content

        if sanitize:
            text_content = self._sanitize_text(text_content)

        return text_content

    def _sanitize_text(self, text: str) -> str:
        """Sanitize text content by removing problematic characters."""
        # Remove NULL bytes that PostgreSQL cannot handle
        text = text.replace("\x00", "")

        # Remove other control characters (except common whitespace: \t \n \r)
        # Keep: tab (09), newline (0A), carriage return (0D)
        # Remove: 00-08, 0B-0C, 0E-1F (other control characters)
        sanitized = []
        for char in text:
            code = ord(char)
            # Keep printable characters and common whitespace
            if code >= 32 or code in (9, 10, 13):
                sanitized.append(char)
        text = "".join(sanitized)

        # Remove zero-width characters that can cause issues
        zero_width_chars = [
            "\u200b",  # Zero-width space
            "\u200c",  # Zero-width non-joiner
            "\u200d",  # Zero-width joiner
            "\ufeff",  # Zero-width no-break space (BOM)
        ]
        for char in zero_width_chars:
            text = text.replace(char, "")

        # Normalize excessive whitespace
        # Replace multiple spaces with single space
        text = re.sub(r" {2,}", " ", text)
        # Replace multiple newlines with maximum of 2
        text = re.sub(r"\n{3,}", "\n\n", text)
        # Remove trailing whitespace from lines
        text = "\n".join(line.rstrip() for line in text.split("\n"))

        # Strip leading/trailing whitespace from entire text
        text = text.strip()

        return text


file_service = FileService()
