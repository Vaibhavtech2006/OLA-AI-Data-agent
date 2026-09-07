# Data Agent — Backend (FastAPI)

Thin REST API in front of the existing LangGraph `data_agent` router (SQL Analyst +
ETL Analyst sub-agents). Ships with a **demo mode** so the frontend is fully usable
even before the agents / Postgres / API keys are wired up.

## Run it

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env   # fill in your keys + db creds
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Connecting the real agents

`app/services/agent_service.py` tries to `import agents.data_agent` (the module
from the root `Data_Agent` project). Two ways to wire it up:

1. Place this `backend/` folder inside the existing `Data_Agent/` project root, or
2. Add the `Data_Agent` project root to `PYTHONPATH`:
   ```bash
   export PYTHONPATH=/path/to/Data_Agent:$PYTHONPATH
   ```

If the import fails, every `/api/chat` call falls back to a keyword-based demo
responder so you can build/demo the UI independently.

## Endpoints

| Method | Path          | Description                                   |
|--------|---------------|------------------------------------------------|
| POST   | `/api/chat`   | Send a natural-language query to the router    |
| GET    | `/api/history`| Recent query history (list, newest first)      |
| GET    | `/api/stats`  | Aggregate counts for the dashboard              |
| GET    | `/api/health` | Liveness check                                  |
