"""Investigation service — orchestrates agent pipeline and persists results."""

import re

from agents.graph import run_investigation
from database.connection import SessionLocal
from database.models import InvestigationHistory


def _extract_batch_id(query: str) -> str:
    m = re.search(r"EV-\d{4}", query, re.IGNORECASE)
    return m.group(0).upper() if m else "EV-XXXX"


def _parse_confidence(conf_str: str) -> int:
    try:
        return min(99, max(0, int(str(conf_str).replace("%", "").strip())))
    except (ValueError, AttributeError):
        return 80


def _infer_severity(confidence: int) -> str:
    if confidence >= 85:
        return "High"
    if confidence >= 70:
        return "Medium"
    return "Low"


def _classify_evidence(evidence: list[str]) -> dict:
    sop_refs = []
    historical = []
    maintenance = []
    sensor = []

    for e in evidence:
        el = e.lower()
        if "sop" in el:
            sop_refs.append(e)
        elif "failure" in el or "batch" in el or "historical" in el:
            historical.append(e)
        elif "maintenance" in el or "calibration" in el or "machine" in el:
            maintenance.append(e)
        elif "violation" in el or "sensor" in el or "threshold" in el or "anomaly" in el:
            sensor.append(e)
        else:
            sop_refs.append(e)

    return {
        "sopReferences": sop_refs,
        "historicalIncidents": historical,
        "maintenanceRecords": maintenance,
        "sensorReadings": sensor,
    }


def _extract_contributing_factors(evidence: list[str], sensor_analysis: dict) -> list[str]:
    factors = []
    keywords = {
        "humidity": "Humidity deviation",
        "coating": "Coating thickness variation",
        "temperature": "Temperature deviation",
        "weld": "Weld parameter deviation",
        "seal": "Seal integrity issue",
        "calibration": "Calibration drift",
        "maintenance": "Delayed maintenance",
        "formation": "Formation process deviation",
    }
    combined = " ".join(evidence).lower()
    for kw, label in keywords.items():
        if kw in combined and label not in factors:
            factors.append(label)

    for anomaly in sensor_analysis.get("anomalies", []):
        label = f"{anomaly['parameter'].replace('_', ' ').title()} anomaly"
        if label not in factors:
            factors.append(label)

    return factors if factors else ["Process deviation"]


def _split_recommendations(recommendations: list[str]) -> tuple[list[str], list[str]]:
    corrective = []
    preventive = []
    preventive_keywords = ["prevent", "schedule", "add alert", "automate", "implement", "introduce", "monitor"]
    for r in recommendations:
        if any(kw in r.lower() for kw in preventive_keywords):
            preventive.append(r)
        else:
            corrective.append(r)
    if not corrective:
        corrective = recommendations
        preventive = []
    return corrective, preventive


def investigate(query: str) -> dict:
    """Run full investigation pipeline and return frontend-compatible schema."""
    result = run_investigation(query)

    batch_id = _extract_batch_id(query)
    confidence_str = result.get("confidence", "80%")
    confidence_int = _parse_confidence(confidence_str)
    severity = _infer_severity(confidence_int)
    evidence = result.get("evidence", [])
    recommendations = result.get("recommendations", [])
    sensor_analysis = result.get("sensor_analysis", {})
    root_cause = result.get("root_cause", "Root cause could not be determined.")

    classified = _classify_evidence(evidence)
    contributing_factors = _extract_contributing_factors(evidence, sensor_analysis)
    corrective_actions, preventive_actions = _split_recommendations(recommendations)

    # Derive sensor readings from anomalies if sensorReadings list is empty
    if not classified["sensorReadings"]:
        for anomaly in sensor_analysis.get("anomalies", []):
            classified["sensorReadings"].append(
                f"{anomaly['parameter'].replace('_', ' ').title()}: "
                f"{anomaly['value']} (threshold: {anomaly['threshold']})"
            )

    db = SessionLocal()
    try:
        record = InvestigationHistory(
            query=query,
            root_cause=root_cause,
            confidence=confidence_str,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        investigation_id = record.id
    finally:
        db.close()

    return {
        "investigation_id": investigation_id,
        "batchId": batch_id,
        "failureType": _infer_failure_type(query, root_cause),
        "productionLine": _infer_production_line(root_cause, evidence),
        "confidence": confidence_int,
        "severity": severity,
        "status": "Completed",
        "summary": root_cause,
        "rootCause": root_cause,
        "evidenceSources": evidence,
        "sopReferences": classified["sopReferences"],
        "historicalIncidents": classified["historicalIncidents"],
        "maintenanceRecords": classified["maintenanceRecords"],
        "sensorReadings": classified["sensorReadings"],
        "correctiveActions": corrective_actions,
        "preventiveActions": preventive_actions,
        "contributingFactors": contributing_factors,
        "impact": _infer_impact(root_cause, severity),
    }


def _infer_failure_type(query: str, root_cause: str) -> str:
    combined = (query + " " + root_cause).lower()
    if "capacity" in combined:
        return "Capacity Testing Failure"
    if "resistance" in combined:
        return "Internal Resistance Spike"
    if "thermal" in combined or "temperature" in combined:
        return "Thermal Instability"
    if "weld" in combined:
        return "Tab Welding Defect"
    if "leak" in combined or "seal" in combined:
        return "Electrolyte Leakage"
    if "humidity" in combined:
        return "Humidity Excursion"
    if "coating" in combined:
        return "Coating Defect"
    return "Manufacturing Defect"


def _infer_production_line(root_cause: str, evidence: list[str]) -> str:
    combined = (root_cause + " " + " ".join(evidence)).lower()
    if "coating" in combined:
        return "Coating Line A"
    if "weld" in combined:
        return "Welding Station B"
    if "drying" in combined or "humidity" in combined:
        return "Drying Chamber B"
    if "formation" in combined:
        return "Formation Chamber C"
    if "seal" in combined:
        return "Sealing Line D"
    return "Production Line"


def _infer_impact(root_cause: str, severity: str) -> str:
    rc = root_cause.lower()
    if "coating" in rc:
        return "Reduced cell capacity and inconsistent active material distribution"
    if "humidity" in rc:
        return "Moisture-induced capacity degradation and increased internal resistance"
    if "weld" in rc:
        return "Poor electrical contact and increased tab resistance"
    if "seal" in rc or "leak" in rc:
        return "Electrolyte loss and potential cell failure under load"
    if "temperature" in rc or "thermal" in rc:
        return "Inconsistent formation cycling and capacity fade"
    return f"{severity} severity manufacturing defect affecting batch yield"


def get_history() -> list[dict]:
    """Return all previous investigations."""
    db = SessionLocal()
    try:
        records = db.query(InvestigationHistory).order_by(
            InvestigationHistory.created_at.desc()
        ).all()
        return [
            {
                "id": r.id,
                "query": r.query,
                "root_cause": r.root_cause,
                "confidence": r.confidence,
                "created_at": r.created_at.isoformat(),
            }
            for r in records
        ]
    finally:
        db.close()