"""FastAPI route handlers for CellSage AI."""

import logging

from fastapi import APIRouter, HTTPException

from api.schemas import (
    HealthResponse,
    HistoryResponse,
    InvestigateResponse,
    InvestigationRecord,
    QueryRequest,
    ReportRequest,
    ReportResponse,
    RetrieveResponse,
)
from rag.chroma_client import get_collection
from services import investigation_service, report_service, retrieval_service
from services.llm_service import get_llm_mode

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/retrieve", response_model=RetrieveResponse)
def retrieve_documents(request: QueryRequest):
    result = retrieval_service.search(request.query)
    return RetrieveResponse(
        documents=result["documents"],
        scores=result["scores"],
        sources=result["sources"],
    )


@router.post("/investigate", response_model=InvestigateResponse)
def investigate_failure(request: QueryRequest):
    try:
        result = investigation_service.investigate(request.query)
    except Exception as exc:
        logger.exception("Investigation pipeline failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))
    return InvestigateResponse(
        root_cause=result["root_cause"],
        confidence=result["confidence"],
        evidence=result["evidence"],
        recommendations=result["recommendations"],
    )


@router.get("/history", response_model=HistoryResponse)
def get_investigation_history():
    records = investigation_service.get_history()
    return HistoryResponse(
        investigations=[InvestigationRecord(**r) for r in records]
    )


@router.post("/report", response_model=ReportResponse)
def generate_investigation_report(request: ReportRequest):
    try:
        result = report_service.generate_report(
            query=request.query,
            investigation_id=request.investigation_id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.exception("Report generation failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))

    return ReportResponse(
        report_id=result["report_id"],
        batch_id=result["batch_id"],
        generated_date=result["generated_date"],
        status=result["status"],
        confidence=result["confidence"],
        severity=result["severity"],
        query=result["query"],
        executive_summary=result["executive_summary"],
        findings=result["findings"],
        evidence_sources=result["evidence_sources"],
        root_cause_analysis=result["root_cause_analysis"],
        corrective_actions=result["corrective_actions"],
        preventive_actions=result["preventive_actions"],
        confidence_assessment=result["confidence_assessment"],
        raw_report=result["raw_report"],
    )


@router.get("/health", response_model=HealthResponse)
def health_check():
    try:
        count = get_collection().count()
    except Exception:
        count = 0
    return HealthResponse(
        status="ok",
        llm_mode=get_llm_mode(),
        chroma_documents=count,
    )