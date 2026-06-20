"""Retrieval Augmented Generation pipeline."""

from rag.retriever import retrieve
from services.llm_service import generate_response


def build_context(documents: list[str], sources: list[dict]) -> str:
    """Build numbered context string from retrieved documents."""
    parts = []
    for i, (doc, source) in enumerate(zip(documents, sources), start=1):
        source_label = source.get("source", "unknown")
        source_id = source.get("source_id", "N/A")
        parts.append(f"[Source {i} | {source_label}: {source_id}]\n{doc}")
    return "\n\n".join(parts)


def run_rag_pipeline(query: str, top_k: int = 5) -> dict:
    """
    Full RAG flow: retrieve → build context → LLM generation.
    """
    retrieval = retrieve(query, top_k=top_k)
    documents = retrieval["documents"]
    scores = retrieval["scores"]
    sources = retrieval["sources"]

    if not documents:
        return {
            "answer": "No relevant manufacturing documents found for this query.",
            "documents": [],
            "scores": [],
            "sources": [],
        }

    context = build_context(documents, sources)
    prompt = (
        "You are CellSage AI, an expert in EV battery manufacturing root cause analysis.\n"
        "Use the following retrieved context to answer the user query accurately.\n"
        "Cite specific SOPs, batch IDs, or machine names when relevant.\n\n"
        f"Context:\n{context}\n\n"
        f"Query: {query}\n\n"
        "Answer:"
    )
    answer = generate_response(prompt)

    return {
        "answer": answer,
        "documents": documents,
        "scores": scores,
        "sources": sources,
    }
