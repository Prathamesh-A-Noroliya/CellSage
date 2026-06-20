"""LangGraph orchestrator for multi-agent investigation pipeline."""

from langgraph.graph import END, StateGraph

from agents.recommendation_agent import recommendation_agent
from agents.retrieval_agent import retrieval_agent
from agents.root_cause_agent import root_cause_agent
from agents.sensor_agent import sensor_agent
from agents.state import InvestigationState


def build_investigation_graph():
    """Build and compile the investigation agent graph."""
    graph = StateGraph(InvestigationState)

    graph.add_node("retrieval", retrieval_agent)
    graph.add_node("sensor", sensor_agent)
    graph.add_node("root_cause", root_cause_agent)
    graph.add_node("recommendation", recommendation_agent)

    graph.set_entry_point("retrieval")
    graph.add_edge("retrieval", "sensor")
    graph.add_edge("sensor", "root_cause")
    graph.add_edge("root_cause", "recommendation")
    graph.add_edge("recommendation", END)

    return graph.compile()


def run_investigation(query: str) -> InvestigationState:
    """Execute the full investigation pipeline for a query."""
    app = build_investigation_graph()
    initial_state: InvestigationState = {"query": query}
    return app.invoke(initial_state)
