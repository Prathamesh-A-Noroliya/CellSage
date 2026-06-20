"""Investigation state shared across LangGraph agents."""

from typing import TypedDict


class InvestigationState(TypedDict, total=False):
    query: str
    retrieved_docs: list
    scores: list
    sources: list
    sensor_analysis: dict
    root_cause: str
    confidence: str
    evidence: list
    recommendations: list
    report: str
