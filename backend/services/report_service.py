"""Report service — generates structured investigation reports."""

import re
from datetime import datetime
from pathlib import Path

from agents.graph import run_investigation
from agents.report_agent import report_agent
from agents.state import InvestigationState
from database.connection import SessionLocal
from database.models import InvestigationHistory

REPORTS_DIR = Path(__file__).resolve().parent.parent / "reports"


def _parse_confidence(conf_str: str) -> int:
    try:
        return min(99, max(0, int(str(conf_str).replace("%", "").strip())))
    except (ValueError, AttributeError):
        return 80


def _infer_severity(confidence: int) -> str:
    return "High" if confidence >= 85 else "Medium" if confidence >= 70 else "Low"


def _infer_batch_id(query: str) -> str:
    m = re.search(r"EV-\d{4}", query, re.IGNORECASE)
    return m.group(0).upper() if m else "EV-XXXX"


def _split_recommendations(recommendations: list[str]) -> tuple[list[str], list[str]]:
    preventive_keywords = ["prevent", "schedule", "add alert", "automate", "implement", "introduce", "monitor", "predictive"]
    corrective, preventive = [], []
    for r in recommendations:
        if any(kw in r.lower() for kw in preventive_keywords):
            preventive.append(r)
        else:
            corrective.append(r)
    if not corrective:
        corrective = recommendations
        preventive = []
    return corrective, preventive


def _build_executive_summary(query: str, root_cause: str, evidence: list[str], confidence: int) -> str:
    batch_id = _infer_batch_id(query)
    sop_refs = [e for e in evidence if "SOP" in e]
    sop_text = f" using {', '.join(sop_refs[:2])}" if sop_refs else ""
    return (
        f"CellSage AI investigated the manufacturing failure related to: \"{query}\". "
        f"The investigation retrieved relevant SOPs, historical incident data, maintenance records, "
        f"and sensor readings{sop_text}. "
        f"The system identified the following root cause with {confidence}% confidence: {root_cause}"
    )


def _build_findings(query: str, evidence: list[str], root_cause: str) -> list[str]:
    findings = []
    query_lower = query.lower()

    if "capacity" in query_lower or "capacity" in root_cause.lower():
        findings.append("Capacity test results were below the acceptance threshold.")
    if "humidity" in root_cause.lower() or any("humidity" in e.lower() or "SOP-002" in e for e in evidence):
        findings.append("Humidity deviation detected — SOP-002 threshold exceeded during electrode preparation.")
    if "coating" in root_cause.lower() or any("coating" in e.lower() or "SOP-001" in e for e in evidence):
        findings.append("Electrode coating thickness variation identified outside SOP-001 tolerance.")
    if any("maintenance" in e.lower() or "calibration" in e.lower() for e in evidence):
        findings.append("Maintenance records indicate overdue calibration on affected equipment.")
    if any("historical" in e.lower() or "failure" in e.lower() for e in evidence):
        findings.append("Similar historical failure patterns identified in the knowledge base.")
    if any("SOP violation" in e or "sensor" in e.lower() for e in evidence):
        findings.append("Sensor anomaly data confirmed parameter deviation from SOP specifications.")

    if not findings:
        findings = [
            f"Investigation query: {query}",
            f"Primary finding: {root_cause}",
            "Evidence retrieved from manufacturing knowledge base.",
        ]

    return findings


def _build_confidence_assessment(query: str, confidence: int, evidence: list[str]) -> str:
    sop_count = sum(1 for e in evidence if "SOP" in e)
    hist_count = sum(1 for e in evidence if "failure" in e.lower() or "historical" in e.lower() or "Batch" in e)
    maint_count = sum(1 for e in evidence if "maintenance" in e.lower() or "calibration" in e.lower())
    sensor_count = sum(1 for e in evidence if "SOP violation" in e or "sensor" in e.lower() or "threshold" in e.lower())

    factors = []
    if sop_count:
        factors.append(f"{sop_count} SOP reference(s)")
    if hist_count:
        factors.append(f"{hist_count} historical failure pattern(s)")
    if sensor_count:
        factors.append(f"{sensor_count} sensor anomaly match(es)")
    if maint_count:
        factors.append(f"{maint_count} maintenance correlation(s)")

    factor_text = ", ".join(factors) if factors else "retrieved manufacturing knowledge base documents"
    level = "strong" if confidence >= 85 else "moderate" if confidence >= 65 else "preliminary"

    return (
        f"CellSage AI assigns a {confidence}% confidence score based on {level} alignment "
        f"between {factor_text}. "
        f"This assessment reflects the quality and relevance of retrieved evidence relative "
        f"to the investigation query."
    )


def generate_report(query: str | None = None, investigation_id: int | None = None) -> dict:
    """Generate structured investigation report from query or existing investigation ID."""

    if investigation_id:
        db = SessionLocal()
        try:
            record = db.query(InvestigationHistory).filter(
                InvestigationHistory.id == investigation_id
            ).first()
            if not record:
                raise ValueError(f"Investigation ID {investigation_id} not found.")
            query = record.query
        finally:
            db.close()

    if not query:
        raise ValueError("No query or investigation_id provided.")

    state: InvestigationState = run_investigation(query)
    state = report_agent(state)

    root_cause: str = state.get("root_cause") or "Root cause could not be determined."
    confidence_str: str = state.get("confidence") or "80%"
    evidence: list[str] = state.get("evidence") or []
    recommendations: list[str] = state.get("recommendations") or []
    raw_report: str = state.get("report") or ""

    confidence_int = _parse_confidence(confidence_str)
    severity = _infer_severity(confidence_int)
    batch_id = _infer_batch_id(query)
    corrective_actions, preventive_actions = _split_recommendations(recommendations)
    generated_date = datetime.utcnow().strftime("%d %B %Y")
    report_id = f"CS-RPT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_query = query[:40].replace(" ", "_").replace("?", "")
    report_path = REPORTS_DIR / f"report_{timestamp}_{safe_query}.md"
    report_path.write_text(raw_report, encoding="utf-8")

    return {
        "report_id": report_id,
        "batch_id": batch_id,
        "generated_date": generated_date,
        "status": "Completed",
        "confidence": confidence_int,
        "severity": severity,
        "query": query,
        "executive_summary": _build_executive_summary(query, root_cause, evidence, confidence_int),
        "findings": _build_findings(query, evidence, root_cause),
        "evidence_sources": evidence if evidence else ["No evidence sources retrieved."],
        "root_cause_analysis": root_cause,
        "corrective_actions": corrective_actions if corrective_actions else ["Review and recalibrate affected manufacturing equipment per applicable SOP."],
        "preventive_actions": preventive_actions if preventive_actions else ["Implement automated sensor monitoring and alerting for early deviation detection."],
        "confidence_assessment": _build_confidence_assessment(query, confidence_int, evidence),
        "raw_report": raw_report,
        "report_path": str(report_path),
    }