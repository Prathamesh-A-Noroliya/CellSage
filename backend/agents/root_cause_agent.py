"""Agent 3: Root Cause Agent — infer likely root causes from evidence."""

from agents.state import InvestigationState
from services.llm_service import generate_response


def _build_evidence(sources: list, sensor_analysis: dict) -> list[str]:
    evidence = []
    for source in sources:
        src_type = source.get("source", "unknown")
        src_id = source.get("source_id", "N/A")
        if src_type == "failure":
            evidence.append(f"Historical failure case: Batch {src_id} — {source.get('issue', '')}")
        elif src_type == "sop":
            evidence.append(f"SOP reference: {src_id} — {source.get('title', '')}")
        elif src_type == "maintenance":
            evidence.append(f"Maintenance record: {source.get('machine_name', src_id)}")

    for anomaly in sensor_analysis.get("anomalies", []):
        evidence.append(
            f"SOP violation ({anomaly['sop_violation']}): "
            f"{anomaly['parameter']} = {anomaly['value']} (threshold: {anomaly['threshold']})"
        )

    return evidence


def _compute_confidence(scores: list, sensor_analysis: dict) -> str:
    avg_score = sum(scores) / len(scores) if scores else 0.5
    anomaly_boost = 0.1 * sensor_analysis.get("anomaly_count", 0)
    confidence = min(99, int((avg_score + anomaly_boost) * 100))
    return f"{confidence}%"


def root_cause_agent(state: InvestigationState) -> InvestigationState:
    query = state.get("query", "")
    docs = state.get("retrieved_docs", [])
    sources = state.get("sources", [])
    scores = state.get("scores", [])
    sensor_analysis = state.get("sensor_analysis", {})

    context = "\n".join(docs)
    anomaly_summary = ", ".join(
        a["parameter"] for a in sensor_analysis.get("anomalies", [])
    ) or "none detected"

    prompt = (
        "You are a root cause analysis expert for EV battery manufacturing.\n"
        f"Investigation query: {query}\n"
        f"Sensor anomalies: {anomaly_summary}\n"
        f"Retrieved context:\n{context}\n\n"
        "Provide a concise root cause statement (1-2 sentences). "
        "Focus on the most likely manufacturing defect or process deviation."
    )

    root_cause = generate_response(prompt)
    evidence = _build_evidence(sources, sensor_analysis)
    confidence = _compute_confidence(scores, sensor_analysis)

    return {
        **state,
        "root_cause": root_cause,
        "confidence": confidence,
        "evidence": evidence,
    }
