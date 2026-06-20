"""Hybrid LLM service: Groq → Ollama → mock fallback."""

import logging
import os
import re

from dotenv import load_dotenv

load_dotenv(override=True)

logger = logging.getLogger(__name__)

_llm_mode: str | None = None


def get_llm_mode() -> str:
    """Return active LLM mode: groq, ollama, or mock."""
    global _llm_mode
    if _llm_mode is not None:
        return _llm_mode

    if os.getenv("GROQ_API_KEY"):
        _llm_mode = "groq"
    elif os.getenv("OLLAMA_BASE_URL"):
        _llm_mode = "ollama"
    else:
        _llm_mode = "mock"

    logger.info("LLM mode active: %s", _llm_mode)
    return _llm_mode


def _call_groq(prompt: str) -> str:
    from langchain_groq import ChatGroq
    from langchain_core.messages import HumanMessage

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.2,
    )
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content


def _call_ollama(prompt: str) -> str:
    from langchain_community.chat_models import ChatOllama
    from langchain_core.messages import HumanMessage

    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    llm = ChatOllama(model="llama3.1", base_url=base_url, temperature=0.2)
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content


def _mock_response(prompt: str) -> str:
    """Rule-based fallback using retrieved context in the prompt."""
    batch_match = re.search(r"EV-\d{4}", prompt, re.IGNORECASE)
    batch_id = batch_match.group(0).upper() if batch_match else None

    root_cause = "Electrode coating thickness variation exceeding SOP-001 tolerance"
    if "humidity" in prompt.lower():
        root_cause = "Dry room humidity exceeded SOP-002 limit causing moisture-related capacity degradation"
    elif "weld" in prompt.lower():
        root_cause = "Ultrasonic tab weld parameters outside SOP-004 specification"
    elif "seal" in prompt.lower() or "leak" in prompt.lower():
        root_cause = "Pouch cell heat seal integrity below SOP-008 requirements"
    elif "formation" in prompt.lower():
        root_cause = "Formation cycling parameters deviated from SOP-006 protocol"

    if batch_id:
        return (
            f"Based on retrieved manufacturing records for batch {batch_id}, "
            f"the most likely root cause is: {root_cause}. "
            f"Historical cases with similar sensor profiles recommend immediate "
            f"recalibration of affected equipment and quarantine of the batch for re-inspection."
        )

    return (
        f"Based on retrieved SOPs and historical failure data, "
        f"the most likely root cause is: {root_cause}. "
        f"Review sensor logs against applicable SOP thresholds and compare "
        f"with similar historical failure cases in the knowledge base."
    )


def generate_response(prompt: str) -> str:
    """Generate LLM response using the configured provider chain."""
    mode = get_llm_mode()

    try:
        if mode == "groq":
            return _call_groq(prompt)
        if mode == "ollama":
            return _call_ollama(prompt)
    except Exception as exc:
        logger.warning("LLM call failed (%s), falling back to mock: %s", mode, exc)

    return _mock_response(prompt)
