"""Pydantic schemas for API request/response models."""

from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    query: str = Field(..., example="Why did Batch EV-1024 fail capacity testing?")


class RetrieveResponse(BaseModel):
    documents: list[str]
    scores: list[float]
    sources: list[dict]


class InvestigateResponse(BaseModel):
    root_cause: str
    confidence: str
    evidence: list[str]
    recommendations: list[str]


class InvestigationRecord(BaseModel):
    id: int
    query: str
    root_cause: str
    confidence: str
    created_at: str


class HistoryResponse(BaseModel):
    investigations: list[InvestigationRecord]


class ReportRequest(BaseModel):
    query: str | None = Field(default=None)
    investigation_id: int | None = None


class ReportResponse(BaseModel):
    report_id: str
    batch_id: str
    generated_date: str
    status: str
    confidence: int
    severity: str
    query: str
    executive_summary: str
    findings: list[str]
    evidence_sources: list[str]
    root_cause_analysis: str
    corrective_actions: list[str]
    preventive_actions: list[str]
    confidence_assessment: str
    raw_report: str


class HealthResponse(BaseModel):
    status: str
    llm_mode: str
    chroma_documents: int