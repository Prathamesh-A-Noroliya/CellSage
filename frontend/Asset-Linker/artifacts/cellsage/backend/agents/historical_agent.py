"""
historical_agent.py
--------------------
Historical Failure Agent.

Responsible for searching past battery manufacturing failure records to
find cases similar to the current investigation query. Failure records
are loaded from a JSON file (../data/failures.json).

Retrieval logic (in priority order):
    1. Batch ID match  -> if the query contains a batch ID (e.g. EV-1024),
                           return that exact failure record first, followed
                           by other historical failures sharing the same
                           root-cause topic for additional supporting context.
    2. Keyword match    -> if no batch ID is found/matched, fall back to the
                           existing topic keyword search (moisture, welding, etc.)
    3. Default fallback -> if nothing matches, return the top N records.
"""

import json
import os
import re
from typing import List, Dict, Optional

# ---------------------------------------------------------
# File path setup
# ---------------------------------------------------------
# Build an absolute path to the failures data file relative to this
# script's location, so the agent works regardless of the directory
# it's run from.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAILURES_FILE_PATH = os.path.join(BASE_DIR, "..", "data", "failures.json")

# ---------------------------------------------------------
# Keyword topic mapping for simple retrieval filtering
# ---------------------------------------------------------
KEYWORD_TOPICS = {
    "moisture": ["humidity", "moisture", "electrolyte"],
    "welding": ["weld", "welding"],
}

# Default number of records to return when no topic or batch ID matches.
DEFAULT_TOP_N = 5

# Pattern for detecting EV battery batch IDs, e.g. "EV-1024", "ev-0892".
BATCH_ID_PATTERN = re.compile(r"EV-\d{3,4}", re.IGNORECASE)


def _load_failures() -> List[Dict]:
    """
    Load historical failure records from the JSON data file with
    proper error handling.

    Returns:
        List[Dict]: Parsed failure records, or an empty list if loading fails.
    """
    try:
        with open(FAILURES_FILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, list):
                print(f"[HistoricalAgent] Error: expected a list in "
                      f"{FAILURES_FILE_PATH}, got {type(data).__name__}")
                return []
            return data

    except FileNotFoundError:
        print(f"[HistoricalAgent] Error: failure data file not found at "
              f"{FAILURES_FILE_PATH}")
        return []

    except json.JSONDecodeError as e:
        print(f"[HistoricalAgent] Error: invalid JSON in "
              f"{FAILURES_FILE_PATH} - {e}")
        return []

    except Exception as e:
        print(f"[HistoricalAgent] Unexpected error loading failure data: {e}")
        return []


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


def _matches_topic(failure: Dict, keywords: List[str]) -> bool:
    """
    Check whether a failure record's mode/root cause/contributing
    factors contain any of the given keywords (case-insensitive).
    """
    contributing_factors = failure.get("contributing_factors", [])
    if not isinstance(contributing_factors, list):
        contributing_factors = [str(contributing_factors)]

    searchable_text = " ".join([
        str(failure.get("failure_mode", "")),
        str(failure.get("root_cause", "")),
        str(failure.get("defect_stage", "")),
        " ".join(contributing_factors),
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


def _keyword_search(query: str, failures: List[Dict]) -> List[Dict]:
    """
    Existing topic keyword search logic, used as a fallback when no
    batch ID is found (or matched) in the query.
    """
    query_lower = query.lower()

    for topic, keywords in KEYWORD_TOPICS.items():
        if any(keyword in query_lower for keyword in keywords):
            filtered = [f for f in failures if _matches_topic(f, keywords)]
            if filtered:
                print(f"[HistoricalAgent] Matched topic '{topic}' - returning "
                      f"{len(filtered)} relevant failure record(s).")
                return filtered
            print(f"[HistoricalAgent] Topic '{topic}' matched query but no "
                  f"failures matched - falling back to default results.")
            break

    print(f"[HistoricalAgent] No specific topic matched - returning top "
          f"{DEFAULT_TOP_N} failure record(s).")
    return failures[:DEFAULT_TOP_N]


def find_similar_failures(query: str) -> List[Dict]:
    """
    Find historically similar battery manufacturing failures.

    Args:
        query (str): The investigation query, e.g. "Why did Batch EV-1024 fail?"

    Returns:
        List[Dict]: A list of relevant historical failure records. If a
                    batch ID is found and matched, that exact record is
                    placed first, followed by related failures sharing the
                    same root-cause topic. Returns an empty list if the
                    data file could not be loaded.
    """
    print(f"[HistoricalAgent] Searching historical failures for query: '{query}'")

    failures = _load_failures()
    if not failures:
        print("[HistoricalAgent] No historical failure records available to search.")
        return []

    # --- Step 1: Batch ID lookup ---
    batch_id = _extract_batch_id(query)
    if batch_id:
        matches = [f for f in failures if str(f.get("batch_id", "")).upper() == batch_id]
        if matches:
            matched_record = matches[0]
            print(f"[HistoricalAgent] Found exact batch match for "
                  f"'{batch_id}': {matched_record.get('failure_id', 'N/A')}")

            results = [matched_record]

            # Pull in other failures sharing the same root-cause topic for
            # additional supporting context (excluding the matched record).
            related_keywords = _find_related_topic(matched_record.get("root_cause", ""))
            if related_keywords:
                related = [
                    f for f in failures
                    if f is not matched_record and _matches_topic(f, related_keywords)
                ]
                if related:
                    print(f"[HistoricalAgent] Found {len(related)} related "
                          f"historical failure(s) with similar root cause.")
                    results.extend(related)

            return results

        # Batch ID was found in the query but doesn't exist in the dataset.
        print(f"[HistoricalAgent] Batch ID '{batch_id}' not found in failure "
              f"records - falling back to keyword search.")

    # --- Step 2 & 3: Existing keyword search logic / default fallback ---
    return _keyword_search(query, failures)