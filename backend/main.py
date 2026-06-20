"""CellSage AI — FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from database.connection import Base, engine
from database.seed import seed_database
from rag.ingest import ingest_documents
from services.llm_service import get_llm_mode

load_dotenv(override=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and ChromaDB on startup."""
    Base.metadata.create_all(bind=engine)
    seed_database()
    logger.info("Database initialized and seeded.")

    chunk_count = ingest_documents()
    if chunk_count:
        logger.info("ChromaDB ingested %d document chunks.", chunk_count)
    else:
        logger.info("ChromaDB collection already populated.")

    logger.info("CellSage AI ready. LLM mode: %s", get_llm_mode())
    yield


app = FastAPI(
    title="CellSage AI",
    description="Agentic AI Copilot for EV Battery Manufacturing Root Cause Analysis",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "name": "CellSage AI",
        "description": "EV Battery Manufacturing Root Cause Analysis Copilot",
        "docs": "/docs",
        "endpoints": ["/retrieve", "/investigate", "/history", "/report", "/health"],
    }
