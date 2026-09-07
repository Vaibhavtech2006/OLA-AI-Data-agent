# Data Agent — Console (Frontend + Backend)

A production-style chat + dashboard console in front of the existing
LangGraph multi-agent system described in the root `Data_Agent` project
(SQL Analyst + ETL Analyst, routed by a Data Agent router).

```
data-agent-app/
├── backend/     FastAPI REST API — wraps agents.data_agent, in-memory history/stats
└── frontend/    React (Vite) console — chat view + dashboard view
```

## Quick start

**1. Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # fill in ANTHROPIC_API_KEY / DB creds
uvicorn app.main:app --reload --port 8000
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173, proxies /api to :8000
```

Open http://localhost:5173. It works immediately in **demo mode** (keyword
routing, fake latency) even with the backend un-configured — real answers
appear automatically once `agents.data_agent` is importable and your API
keys / Postgres are set up (see `backend/README.md`).

## What's inside

- **Chat view** — natural language in, routed answer out. Each response is
  tagged with which agent handled it (SQL Analyst / ETL Analyst), shows the
  generated SQL or Pandas code, and the safety-check result for SQL queries.
- **Dashboard view** — total/SQL/ETL query counts, blocked-unsafe count,
  average latency, an hourly volume chart, and a recent-queries table.
- Design: dark graphite console with a blue accent for the SQL Analyst and a
  green accent for the ETL Analyst, so you can tell at a glance which agent
  answered — mirrors how the underlying router works.

## Production notes

- Swap `backend/app/services/store.py`'s in-memory deque for a Postgres
  table (the same database the SQL Analyst already connects to) for
  durable history across restarts.
- Add auth (e.g. an API-key header checked in `app/main.py` middleware)
  before exposing this beyond localhost.
- `frontend/vite.config.js` proxies `/api` to `localhost:8000` for local
  dev; set a real `VITE_API_BASE` / reverse proxy for deployment.
