"""
orchestrator.py
-----------------
Orchestrator Agent.

The central coordinator of the CellSage AI multi-agent system. It runs
the full investigation pipeline by sequentially invoking the RAG agent,
the historical failure agent, the root cause agent, and finally the
report agent — combining their outputs into one final investigation
report for a given query.
"""

# Import all sub-agents
from rag_agent import retrieve_documents
from historical_agent import find_similar_failures
from root_cause_agent import identify_root_cause
from report_agent import generate_report


def investigate(query: str) -> str:
    """
    Run the full agentic root-cause-analysis pipeline for a given query.

    Pipeline steps (executed sequentially):
        1. RAG Agent       -> retrieve relevant SOP documents.
        2. Historical Agent -> find similar past failures.
        3. Root Cause Agent -> identify the most likely root cause.
        4. Report Agent     -> generate the final formatted report.

    Args:
        query (str): The investigation query, e.g. "Why did Batch EV-1024 fail?"

    Returns:
        str: The final formatted investigation report.
    """

    print(f"\n[Orchestrator] Starting investigation for: '{query}'\n")

    # Step 1: Retrieve relevant SOP documents
    documents = retrieve_documents(query)

    # Step 2: Find similar historical failures
    failures = find_similar_failures(query)

    # Step 3: Identify the root cause using both data sources
    result = identify_root_cause(documents, failures)

    # Step 4: Generate the final human-readable report
    final_report = generate_report(result)

    print("[Orchestrator] Investigation complete.\n")

    return final_report


# ---------------------------------------------------------
# Example run: demonstrates the full pipeline end-to-end.
# ---------------------------------------------------------
if __name__ == "__main__":
    query = "Why did Batch EV-1024 fail capacity testing?"
    print(investigate(query))