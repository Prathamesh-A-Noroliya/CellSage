"""Agent 1: Retrieval Agent — search ChromaDB for relevant documents."""

from agents.state import InvestigationState
from rag.retriever import retrieve


def retrieval_agent(state: InvestigationState) -> InvestigationState:
    query = state.get("query", "")
    results = retrieve(query, top_k=5)

    return {
        **state,
        "retrieved_docs": results["documents"],
        "scores": results["scores"],
        "sources": results["sources"],
    }
