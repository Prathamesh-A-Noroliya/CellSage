"""Retrieval service — business logic for document search."""

from rag.retriever import retrieve


def search(query: str) -> dict:
    """Search manufacturing knowledge base and return documents with scores."""
    return retrieve(query, top_k=5)
