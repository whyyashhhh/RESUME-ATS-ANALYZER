from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

from app.core.config import settings


def chunk_text(text: str, chunk_size: int = 900, overlap: int = 120) -> list[str]:
    cleaned = ' '.join(text.split())
    if not cleaned:
        return []

    chunks: list[str] = []
    start = 0
    length = len(cleaned)
    while start < length:
        end = min(length, start + chunk_size)
        chunks.append(cleaned[start:end])
        if end == length:
            break
        start = max(0, end - overlap)
    return chunks


@dataclass
class RagDocument:
    document_id: str
    text: str
    metadata: dict[str, str] = field(default_factory=dict)


class RagService:
    def __init__(self, persist_directory: str | None = None) -> None:
        self.persist_directory = Path(persist_directory or settings.chroma_persist_directory)
        self.persist_directory.mkdir(parents=True, exist_ok=True)

    def index_text(self, document_id: str, text: str, metadata: dict[str, str] | None = None) -> list[RagDocument]:
        return [RagDocument(document_id=document_id, text=chunk, metadata=metadata or {}) for chunk in chunk_text(text)]

    def search(self, query: str, documents: Iterable[RagDocument], limit: int = 5) -> list[str]:
        query_terms = set(query.lower().split())
        scored: list[tuple[int, str]] = []
        for document in documents:
            chunk_terms = set(document.text.lower().split())
            score = len(query_terms & chunk_terms)
            if score:
                scored.append((score, document.text))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [text for _, text in scored[:limit]]