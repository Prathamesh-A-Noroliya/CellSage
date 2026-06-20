"""
rag_agent.py
------------
RAG (Retrieval-Augmented Generation) Agent.

Responsible for retrieving relevant Standard Operating Procedure (SOP)
documents related to a given query. SOP records are loaded from a JSON
file (../data/sops.json).

Retrieval logic (in priority order):
    1. Batch ID match  -> if the query contains a batch ID (e.g. EV-1024),
                           look up that batch's failure record in
                           ../data/failures.json and use its root cause
                           text to find related SOP documents.
    2. Keyword match    -> if no batch ID is found/matched (or its root
                           cause maps to no topic), fall back to the
                           existing topic keyword search on the query
                           itself (moisture, welding, etc.)
    3. Default fallback -> if nothing matches, return the top N records.
"""

import json
import os
import re
from typing import List, Dict, Optional

# ---------------------------------------------------------
# File path setup
# ---------------------------------------------------------
# Build absolute paths to the data files relative to this script's
# location, so the agent works regardless of the directory it's run from.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SOPS_FILE_PATH = os.path.join(BASE_DIR, "..", "data", "sops.json")
FAILURES_FILE_PATH = os.path.join(BASE_DIR, "..", "data", "failures.json")

# ---------------------------------------------------------
# Keyword topic mapping for simple retrieval filtering
# ---------------------------------------------------------
KEYWORD_TOPICS = {
    "moisture": ["humidity", "moisture", "electrolyte"],
    "welding": ["weld", "welding"],
}

# Default number of records to return when no keyword topic matches.
DEFAULT_TOP_N = 5

# Pattern for detecting EV battery batch IDs, e.g. "EV-1024", "ev-0892".
BATCH_ID_PATTERN = re.compile(r"EV-\d{3,4}", re.IGNORECASE)


def _load_json_file(file_path: str, agent_label: str) -> List[Dict]:
    """
    Generic JSON list loader with proper error handling, shared by both
    the SOP and failure data loaders below.

    Args:
        file_path (str): Path to the JSON file to load.
        agent_label (str): Label used in log/error messages (e.g. "RAGAgent").

    Returns:
        List[Dict]: Parsed records, or an empty list if loading fails.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, list):
                print(f"[{agent_label}] Error: expected a list in "
                      f"{file_path}, got {type(data).__name__}")
                return []
            return data

    except FileNotFoundError:
        print(f"[{agent_label}] Error: data file not found at {file_path}")
        return []

    except json.JSONDecodeError as e:
        print(f"[{agent_label}] Error: invalid JSON in {file_path} - {e}")
        return []

    except Exception as e:
        print(f"[{agent_label}] Unexpected error loading data from {file_path}: {e}")
        return []


def _load_sops() -> List[Dict]:
    """Load SOP documents from the JSON data file."""
    return _load_json_file(SOPS_FILE_PATH, "RAGAgent")


def _load_failures() -> List[Dict]:
    """Load historical failure records from the JSON data file."""
    return _load_json_file(FAILURES_FILE_PATH, "RAGAgent")


def _extract_batch_id(query: str) -> Optional[str]:
    """
    Extract a batch ID (e.g. "EV-1024") from the query string, if present.

    Args:
        query (str): The investigation query.

    Returns:
        Optional[str]: The matched batch ID in uppercase, or None if not found.
    """
    match = BATCH_ID_PATTERN.search(query)
    return match.group(0).upper() if match else None


def _get_root_cause_for_batch(batch_id: str) -> Optional[str]:
    """
    Look up the root cause text for a given batch ID from the failures
    data file.

    Args:
        batch_id (str): The batch ID to search for, e.g. "EV-1024".

    Returns:
        Optional[str]: The root cause description, or None if the batch
                        ID was not found in the failure records.
    """
    failures = _load_failures()
    for failure in failures:
        if str(failure.get("batch_id", "")).upper() == batch_id:
            return failure.get("root_cause", "")
    return None


def _matches_topic(document: Dict, keywords: List[str]) -> bool:
    """
    Check whether a SOP document's title/content/section contains any
    of the given keywords (case-insensitive).
    """
    searchable_text = " ".join([
        str(document.get("title", "")),
        str(document.get("section", "")),
        str(document.get("content", "")),
    ]).lower()

    return any(keyword in searchable_text for keyword in keywords)


def _find_related_topic(text: str) -> Optional[List[str]]:
    """
    Given a piece of text (e.g. a root cause description), return the
    keyword list of the first matching topic, or None if no topic matches.
    """
    text_lower = text.lower()
    for keywords in KEYWORD_TOPICS.values():
        if any(keyword in text_lower for keyword in keywords):
            return keywords
    return None


def _keyword_search(query: str, documents: List[Dict]) -> List[Dict]:
    """
    Existing topic keyword search logic, used as a fallback when no
    batch ID is found (or its root cause doesn't map to a topic).
    """
    query_lower = query.lower()

    for topic, keywords in KEYWORD_TOPICS.items():
        if any(keyword in query_lower for keyword in keywords):
            filtered = [doc for doc in documents if _matches_topic(doc, keywords)]
            if filtered:
                print(f"[RAGAgent] Matched topic '{topic}' - returning "
                      f"{len(filtered)} relevant SOP(s).")
                return filtered
            print(f"[RAGAgent] Topic '{topic}' matched query but no SOPs "
                  f"matched - falling back to default results.")
            break

    print(f"[RAGAgent] No specific topic matched - returning top "
          f"{DEFAULT_TOP_N} SOP(s).")
    return documents[:DEFAULT_TOP_N]


def retrieve_documents(query: str) -> List[Dict]:
    """
    Retrieve SOP documents relevant to the given query.

    Args:
        query (str): The investigation query, e.g. "Why did Batch EV-1024 fail?"

    Returns:
        List[Dict]: A list of relevant SOP document records. Returns an
                    empty list if the SOP data file could not be loaded.
    """
    print(f"[RAGAgent] Retrieving SOP documents for query: '{query}'")

    documents = _load_sops()
    if not documents:
        print("[RAGAgent] No SOP documents available to search.")
        return []

    # --- Step 1: Batch ID -> root cause -> related SOPs ---
    batch_id = _extract_batch_id(query)
    if batch_id:
        root_cause = _get_root_cause_for_batch(batch_id)
        if root_cause:
            print(f"[RAGAgent] Found root cause for batch '{batch_id}': "
                  f"'{root_cause}'")
            related_keywords = _find_related_topic(root_cause)
            if related_keywords:
                filtered = [doc for doc in documents if _matches_topic(doc, related_keywords)]
                if filtered:
                    print(f"[RAGAgent] Returning {len(filtered)} SOP(s) "
                          f"related to root cause for batch '{batch_id}'.")
                    return filtered
            print(f"[RAGAgent] Root cause for batch '{batch_id}' did not "
                  f"map to a known SOP topic - falling back to keyword search.")
        else:
            print(f"[RAGAgent] Batch ID '{batch_id}' not found in failure "
                  f"records - falling back to keyword search.")

    # --- Step 2 & 3: Existing keyword search logic / default fallback ---
    return _keyword_search(query, documents)