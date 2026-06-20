"""Seed database from JSON data files."""

import json
from datetime import datetime
from pathlib import Path

from database.connection import SessionLocal
from database.models import HistoricalFailure, MaintenanceLog, SOP

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load_json(filename: str) -> list:
    with open(DATA_DIR / filename, encoding="utf-8") as f:
        return json.load(f)


def seed_database() -> None:
    """Load synthetic datasets into the database if tables are empty."""
    db = SessionLocal()
    try:
        if db.query(SOP).count() == 0:
            for item in _load_json("sops.json"):
                db.add(SOP(**item))
            db.commit()

        if db.query(HistoricalFailure).count() == 0:
            for item in _load_json("historical_failures.json"):
                db.add(HistoricalFailure(**item))
            db.commit()

        if db.query(MaintenanceLog).count() == 0:
            for item in _load_json("maintenance_logs.json"):
                record = dict(item)
                record["maintenance_date"] = datetime.strptime(
                    record["maintenance_date"], "%Y-%m-%d"
                ).date()
                db.add(MaintenanceLog(**record))
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully.")
