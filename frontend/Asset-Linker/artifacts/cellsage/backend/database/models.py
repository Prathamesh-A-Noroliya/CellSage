from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Integer, String, Text

from database.connection import Base


class SOP(Base):
    __tablename__ = "sops"

    id = Column(Integer, primary_key=True, index=True)
    sop_code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)


class HistoricalFailure(Base):
    __tablename__ = "historical_failures"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(50), nullable=False, index=True)
    issue = Column(String(255), nullable=False)
    sensor_data = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=False)
    corrective_action = Column(Text, nullable=False)


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)
    machine_name = Column(String(255), nullable=False)
    issue = Column(Text, nullable=False)
    status = Column(String(50), nullable=False)
    maintenance_date = Column(Date, nullable=False)


class InvestigationHistory(Base):
    __tablename__ = "investigation_history"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=False)
    confidence = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
