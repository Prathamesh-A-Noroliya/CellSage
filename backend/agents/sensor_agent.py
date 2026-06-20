"""Agent 2: Sensor Analysis Agent — detect anomalies in sensor readings."""

import re

from agents.state import InvestigationState

# SOP-based thresholds for anomaly detection
THRESHOLDS = {
    "humidity": {"max": 60, "unit": "%", "sop": "SOP-002"},
    "temperature": {"min": 80, "max": 90, "unit": "°C", "sop": "SOP-003", "context": "drying"},
    "coating_thickness": {"tolerance_pct": 2, "sop": "SOP-001"},
    "weld_energy": {"min": 800, "max": 1200, "unit": "J", "sop": "SOP-004"},
}


def _parse_sensor_values(text: str) -> dict:
    """Extract numeric sensor readings from text."""
    readings = {}

    humidity = re.search(r"humidity[:\s]+(\d+(?:\.\d+)?)\s*%", text, re.I)
    if humidity:
        readings["humidity"] = float(humidity.group(1))

    temp = re.search(r"temperature[:\s]+(\d+(?:\.\d+)?)\s*°?c", text, re.I)
    if temp:
        readings["temperature"] = float(temp.group(1))

    coating = re.search(r"coating\s+thickness[:\s]+([+-]?\d+(?:\.\d+)?)\s*%", text, re.I)
    if coating:
        readings["coating_thickness"] = float(coating.group(1))

    weld = re.search(r"weld\s+energy[:\s]+(\d+(?:\.\d+)?)\s*j", text, re.I)
    if weld:
        readings["weld_energy"] = float(weld.group(1))

    return readings


def _detect_anomalies(readings: dict) -> list[dict]:
    anomalies = []

    if "humidity" in readings and readings["humidity"] > THRESHOLDS["humidity"]["max"]:
        anomalies.append(
            {
                "parameter": "humidity",
                "value": readings["humidity"],
                "threshold": f"< {THRESHOLDS['humidity']['max']}%",
                "sop_violation": THRESHOLDS["humidity"]["sop"],
                "severity": "high",
            }
        )

    if "coating_thickness" in readings:
        deviation = abs(readings["coating_thickness"])
        if deviation > THRESHOLDS["coating_thickness"]["tolerance_pct"]:
            anomalies.append(
                {
                    "parameter": "coating_thickness",
                    "value": f"{readings['coating_thickness']}%",
                    "threshold": f"± {THRESHOLDS['coating_thickness']['tolerance_pct']}%",
                    "sop_violation": THRESHOLDS["coating_thickness"]["sop"],
                    "severity": "high",
                }
            )

    if "weld_energy" in readings:
        val = readings["weld_energy"]
        t = THRESHOLDS["weld_energy"]
        if val < t["min"] or val > t["max"]:
            anomalies.append(
                {
                    "parameter": "weld_energy",
                    "value": val,
                    "threshold": f"{t['min']}-{t['max']} J",
                    "sop_violation": t["sop"],
                    "severity": "medium",
                }
            )

    if "temperature" in readings:
        val = readings["temperature"]
        # Drying oven range check when in drying context
        if 70 <= val <= 100:
            t = THRESHOLDS["temperature"]
            if val < t["min"] or val > t["max"]:
                anomalies.append(
                    {
                        "parameter": "drying_temperature",
                        "value": val,
                        "threshold": f"{t['min']}-{t['max']} °C",
                        "sop_violation": t["sop"],
                        "severity": "medium",
                    }
                )

    return anomalies


def sensor_agent(state: InvestigationState) -> InvestigationState:
    query = state.get("query", "")
    docs = state.get("retrieved_docs", [])
    combined_text = query + " " + " ".join(docs)

    readings = _parse_sensor_values(combined_text)
    anomalies = _detect_anomalies(readings)

    sensor_analysis = {
        "readings": readings,
        "anomalies": anomalies,
        "anomaly_count": len(anomalies),
        "status": "anomalies_detected" if anomalies else "within_spec",
    }

    return {**state, "sensor_analysis": sensor_analysis}
