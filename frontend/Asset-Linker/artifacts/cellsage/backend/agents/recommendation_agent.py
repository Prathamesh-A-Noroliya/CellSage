"""Agent 4: Recommendation Agent — generate corrective actions."""

from agents.state import InvestigationState
from services.llm_service import generate_response


def _extract_corrective_actions(sources: list) -> list[str]:
    """Pull corrective actions from retrieved failure case metadata in docs."""
    recommendations = []
    seen = set()
    for source in sources:
        if source.get("source") == "failure":
            batch = source.get("batch_id", "")
            key = f"Review batch {batch} corrective history"
            if key not in seen:
                recommendations.append(key)
                seen.add(key)
    return recommendations


def recommendation_agent(state: InvestigationState) -> InvestigationState:
    query = state.get("query", "")
    root_cause = state.get("root_cause", "")
    sources = state.get("sources", [])
    sensor_analysis = state.get("sensor_analysis", {})
    docs = state.get("retrieved_docs", [])

    prompt = (
        "You are an EV battery manufacturing engineer recommending corrective actions.\n"
        f"Investigation: {query}\n"
        f"Root cause: {root_cause}\n"
        f"Sensor analysis: {sensor_analysis}\n"
        f"Context:\n{' '.join(docs[:3])}\n\n"
        "List 3-5 specific corrective actions as a numbered list."
    )

    llm_recommendations = generate_response(prompt)
    base_recommendations = _extract_corrective_actions(sources)

    # Parse numbered list from LLM response
    lines = [line.strip() for line in llm_recommendations.split("\n") if line.strip()]
    parsed = []
    for line in lines:
        cleaned = line.lstrip("0123456789.-) ")
        if cleaned and len(cleaned) > 10:
            parsed.append(cleaned)

    recommendations = parsed[:5] if parsed else [
        "Recalibrate affected manufacturing equipment per applicable SOP.",
        "Quarantine affected batch for re-inspection and capacity re-testing.",
        "Review maintenance logs for related machine calibration status.",
    ]
    recommendations = base_recommendations + recommendations

    return {**state, "recommendations": recommendations[:6]}
