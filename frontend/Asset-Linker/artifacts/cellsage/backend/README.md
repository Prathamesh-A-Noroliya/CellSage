# CellSage AI

**Agentic AI Copilot for EV Battery Manufacturing Root Cause Analysis**

CellSage AI helps manufacturing engineers investigate EV battery production failures automatically. Instead of manually searching SOP documents, quality manuals, historical failure reports, maintenance records, and sensor logs for hours, engineers can get root cause analysis in minutes using RAG and multi-agent AI.

## Features

- **RAG-powered retrieval** over SOPs, historical failures, and maintenance logs (ChromaDB)
- **Multi-agent investigation pipeline** (LangGraph): retrieval → sensor analysis → root cause → recommendations
- **Hybrid LLM** support: Groq API → Ollama local → mock fallback (works offline)
- **Investigation history** persisted in SQLite/PostgreSQL
- **Automated report generation** saved to `reports/`

## Architecture

```
User Query
    │
    ▼
FastAPI (/investigate)
    │
    ▼
Investigation Service
    │
    ▼
LangGraph Agent Pipeline
    ├── Retrieval Agent      → ChromaDB (top-5 docs)
    ├── Sensor Analysis Agent → SOP threshold checks
    ├── Root Cause Agent     → LLM inference
    └── Recommendation Agent → Corrective actions
    │
    ▼
PostgreSQL / SQLite (investigation_history)
```

## Prerequisites

- Python 3.10+
- (Optional) PostgreSQL 14+
- (Optional) Ollama with `llama3.1` for local LLM
- (Optional) Groq API key for cloud LLM

## Quick Start

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux

# Run the server
uvicorn main:app --reload
```

Open **http://127.0.0.1:8000/docs** for interactive API documentation.

On first startup, the app will:
1. Create database tables (SQLite by default)
2. Seed SOPs, failures, and maintenance logs from `data/*.json`
3. Ingest documents into ChromaDB (`chroma_db/`)

## PostgreSQL Setup

By default, CellSage uses SQLite (`sqlite:///./cellsage.db`) for zero-config hackathon demos.

To use PostgreSQL, update `.env`:

```env
DATABASE_URL=postgresql://cellsage:cellsage@localhost:5432/cellsage
```

Create the database:

```sql
CREATE DATABASE cellsage;
CREATE USER cellsage WITH PASSWORD 'cellsage';
GRANT ALL PRIVILEGES ON DATABASE cellsage TO cellsage;
```

## ChromaDB Setup

ChromaDB runs locally with persistent storage in `./chroma_db`. No separate server is required.

Collection name: `manufacturing_knowledge`

Embeddings: `all-MiniLM-L6-v2` via ChromaDB default ONNX embeddings (runs locally, no GPU required)

To force re-ingestion:

```bash
python -m rag.ingest
```

## LLM Configuration

CellSage uses a hybrid LLM chain (first available wins):

| Priority | Provider | Environment Variable |
|----------|----------|---------------------|
| 1 | Groq (Llama 3.1 70B) | `GROQ_API_KEY` |
| 2 | Ollama (Llama 3.1) | `OLLAMA_BASE_URL` (default: `http://localhost:11434`) |
| 3 | Mock (offline demo) | No keys needed |

Check active mode: `GET /health`

## API Examples

### Retrieve relevant documents

```bash
curl -X POST http://127.0.0.1:8000/retrieve \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Why did Batch EV-1001 fail capacity testing?\"}"
```

Response:

```json
{
  "documents": ["Batch EV-1001 - Capacity Failure..."],
  "scores": [0.87],
  "sources": [{"source": "failure", "batch_id": "EV-1001"}]
}
```

### Run full investigation

```bash
curl -X POST http://127.0.0.1:8000/investigate \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Why did Batch EV-1001 fail capacity testing?\"}"
```

Response:

```json
{
  "root_cause": "Electrode coating thickness variation...",
  "confidence": "91%",
  "evidence": ["Historical failure case: Batch EV-1001 — Capacity Failure"],
  "recommendations": ["Recalibrate coating machine slot-die gap..."]
}
```

### View investigation history

```bash
curl http://127.0.0.1:8000/history
```

### Generate investigation report

```bash
curl -X POST http://127.0.0.1:8000/report \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Why did Batch EV-1001 fail capacity testing?\"}"
```

Reports are also saved to `reports/` as Markdown files.

## Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── api/
│   ├── routes.py           # API endpoints
│   └── schemas.py          # Pydantic models
├── rag/
│   ├── chroma_client.py    # ChromaDB initialization
│   ├── ingest.py           # Document ingestion + chunking
│   ├── retriever.py        # Similarity search (top-k=5)
│   └── rag_pipeline.py     # RAG orchestration
├── agents/
│   ├── graph.py            # LangGraph pipeline
│   ├── retrieval_agent.py
│   ├── sensor_agent.py
│   ├── root_cause_agent.py
│   ├── recommendation_agent.py
│   └── report_agent.py
├── database/
│   ├── connection.py       # SQLAlchemy engine + sessions
│   ├── models.py           # ORM models
│   └── seed.py             # JSON → DB seeding
├── services/
│   ├── llm_service.py      # Hybrid LLM
│   ├── retrieval_service.py
│   ├── investigation_service.py
│   └── report_service.py
├── data/
│   ├── sops.json           # 10 SOP documents
│   ├── historical_failures.json  # 20 failure cases
│   └── maintenance_logs.json     # 10 maintenance records
├── chroma_db/              # ChromaDB persistent storage
├── reports/                # Generated investigation reports
├── requirements.txt
└── README.md
```

## Demo Script (Hackathon)

1. Start the server: `uvicorn main:app --reload`
2. Check health: `GET /health` — confirm ChromaDB has documents
3. Investigate a known failure:

   ```bash
   curl -X POST http://127.0.0.1:8000/investigate \
     -H "Content-Type: application/json" \
     -d "{\"query\": \"Why did Batch EV-1024 fail capacity testing?\"}"
   ```

4. Show retrieved evidence and SOP violations in the response
5. Generate a report: `POST /report` with the same query
6. Show investigation history: `GET /history`

## License

Hackathon project — CellSage AI
