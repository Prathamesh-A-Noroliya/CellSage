"""ChromaDB client for manufacturing knowledge base."""

import os
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions

BASE_DIR = Path(__file__).resolve().parent.parent
COLLECTION_NAME = "manufacturing_knowledge"
DEFAULT_PERSIST_DIR = BASE_DIR / "chroma_db"


def get_persist_dir() -> Path:
    persist = os.getenv("CHROMA_PERSIST_DIR", str(DEFAULT_PERSIST_DIR))
    path = Path(persist)
    if not path.is_absolute():
        path = BASE_DIR / path
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_embedding_function():
    """Use ChromaDB default ONNX embeddings (no torch/sentence-transformers required)."""
    return embedding_functions.DefaultEmbeddingFunction()


def get_chroma_client() -> chromadb.PersistentClient:
    return chromadb.PersistentClient(path=str(get_persist_dir()))


def get_collection():
    """Get or create the manufacturing knowledge collection."""
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=get_embedding_function(),
        metadata={"description": "EV battery manufacturing knowledge base"},
    )


def reset_collection():
    """Delete and recreate the collection (useful for re-ingestion)."""
    client = get_chroma_client()
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    return get_collection()


def collection_is_empty() -> bool:
    collection = get_collection()
    return collection.count() == 0
