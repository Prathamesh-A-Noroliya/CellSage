"""ChromaDB similarity search retriever."""

from rag.chroma_client import get_collection

DEFAULT_TOP_K = 5


def retrieve(query: str, top_k: int = DEFAULT_TOP_K) -> dict:
    """
    Retrieve top-k relevant documents from ChromaDB.
    Returns documents, similarity scores, and source metadata.
    """
    collection = get_collection()
    results = collection.query(query_texts=[query], n_results=top_k)

    documents = results.get("documents", [[]])[0]
    distances = results.get("distances", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    # Convert distance to similarity score (lower distance = higher similarity)
    scores = [round(max(0.0, 1.0 - d), 4) for d in distances]
    sources = [dict(meta) if meta else {} for meta in metadatas]

    return {
        "documents": documents,
        "scores": scores,
        "sources": sources,
    }
