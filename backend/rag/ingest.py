"""Document ingestion into ChromaDB from JSON datasets."""

import json
from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter

from rag.chroma_client import collection_is_empty, get_collection

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def _load_json(filename: str) -> list:
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)


def _split_text(text: str) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    chunks = splitter.split_text(text)
    return chunks if chunks else [text]


def _format_sop_doc(sop: dict) -> str:
    return f"SOP {sop['sop_code']}: {sop['title']}\n{sop['content']}"


def _format_failure_doc(failure: dict) -> str:
    return (
        f"Batch {failure['batch_id']} - {failure['issue']}\n"
        f"Sensor Data: {failure['sensor_data']}\n"
        f"Root Cause: {failure['root_cause']}\n"
        f"Corrective Action: {failure['corrective_action']}"
    )


def _format_maintenance_doc(log: dict) -> str:
    return (
        f"Machine: {log['machine_name']}\n"
        f"Issue: {log['issue']}\n"
        f"Status: {log['status']}\n"
        f"Maintenance Date: {log['maintenance_date']}"
    )


def ingest_documents(force: bool = False) -> int:
    """
    Ingest SOPs, historical failures, and maintenance logs into ChromaDB.
    Returns the number of chunks ingested.
    """
    if not force and not collection_is_empty():
        return 0

    collection = get_collection()
    ids: list[str] = []
    documents: list[str] = []
    metadatas: list[dict] = []

    for sop in _load_json("sops.json"):
        text = _format_sop_doc(sop)
        for i, chunk in enumerate(_split_text(text)):
            ids.append(f"sop-{sop['sop_code']}-chunk-{i}")
            documents.append(chunk)
            metadatas.append(
                {
                    "source": "sop",
                    "source_id": sop["sop_code"],
                    "title": sop["title"],
                }
            )

    for failure in _load_json("historical_failures.json"):
        text = _format_failure_doc(failure)
        for i, chunk in enumerate(_split_text(text)):
            ids.append(f"failure-{failure['batch_id']}-chunk-{i}")
            documents.append(chunk)
            metadatas.append(
                {
                    "source": "failure",
                    "source_id": failure["batch_id"],
                    "batch_id": failure["batch_id"],
                    "issue": failure["issue"],
                }
            )

    for log in _load_json("maintenance_logs.json"):
        text = _format_maintenance_doc(log)
        machine_slug = log["machine_name"].replace(" ", "-").lower()
        for i, chunk in enumerate(_split_text(text)):
            ids.append(f"maintenance-{machine_slug}-chunk-{i}")
            documents.append(chunk)
            metadatas.append(
                {
                    "source": "maintenance",
                    "source_id": log["machine_name"],
                    "machine_name": log["machine_name"],
                    "status": log["status"],
                }
            )

    if documents:
        collection.upsert(ids=ids, documents=documents, metadatas=metadatas)

    return len(documents)


if __name__ == "__main__":
    count = ingest_documents(force=True)
    print(f"Ingested {count} document chunks into ChromaDB.")
