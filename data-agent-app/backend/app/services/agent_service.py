"""
Wraps the existing multi-agent system (agents/data_agent.py in the root
Data_Agent project) behind a simple async-friendly function.

Import is deferred and wrapped in try/except so the API layer, the frontend,
and the dashboard can all be developed and demoed even before the
LangGraph agents / Postgres database / API keys are wired up. If the real
`agents.data_agent` package is importable (i.e. this backend is placed next
to the existing Data_Agent project, or that package is on PYTHONPATH), it is
used automatically — no code changes required.
"""
import time
from typing import Optional

from app.models import ChatResponse

_data_agent = None
_import_error: Optional[str] = None

try:
    from agents.data_agent import data_agent as _data_agent  # type: ignore
    from langchain_core.messages import HumanMessage  # type: ignore
except Exception as exc:  # pragma: no cover - depends on sibling project
    _import_error = str(exc)


def _extract_route(raw_state: dict) -> str:
    route = (raw_state.get("route_response") or "").strip().lower()
    return route if route in ("sql", "etl") else "unknown"


def _extract_answer(raw_state: dict) -> str:
    messages = raw_state.get("messages") or []
    if messages:
        last = messages[-1]
        content = getattr(last, "content", None) or (
            last.get("content") if isinstance(last, dict) else None
        )
        if content:
            return str(content)
    return raw_state.get("final_answer", "No answer produced.")


async def run_agent(message: str, session_id: str) -> ChatResponse:
    start = time.perf_counter()

    if _data_agent is not None:
        raw_state = _data_agent.invoke(
            {"messages": [HumanMessage(content=message)], "route_response": ""}
        )
        route = _extract_route(raw_state)
        answer = _extract_answer(raw_state)
        latency_ms = int((time.perf_counter() - start) * 1000)
        return ChatResponse(
            session_id=session_id,
            route=route,  # type: ignore[arg-type]
            answer=answer,
            generated_sql=raw_state.get("generated_sql_query"),
            is_safe=raw_state.get("is_safe"),
            latency_ms=latency_ms,
            timestamp=_now(),
        )

    # --- Demo fallback: no LangGraph agent package on PYTHONPATH yet ---
    return _demo_response(message, session_id, start)


def _demo_response(message: str, session_id: str, start: float) -> ChatResponse:
    lowered = message.lower()
    etl_keywords = ("extract", "transform", "load", "csv", "json", "parquet", "api", "save")
    route = "etl" if any(k in lowered for k in etl_keywords) else "sql"

    if route == "sql":
        answer = (
            "(demo mode — connect agents.data_agent to run for real) "
            "Generated a SELECT query against the schema and returned the top rows."
        )
        generated_sql = "SELECT * FROM rides ORDER BY rating DESC LIMIT 10;"
        is_safe = "Yes"
        generated_code = None
    else:
        answer = (
            "(demo mode — connect agents.data_agent to run for real) "
            "Generated a Pandas transform and wrote the result to data/transform."
        )
        generated_sql = None
        is_safe = None
        generated_code = "df = pd.read_csv('data/rides.csv')\ndf = df[df['rating'] > 4.0]\ndf.to_json('data/transform/rides.json', orient='records')"

    latency_ms = int((time.perf_counter() - start) * 1000) + 180  # simulate realistic latency
    return ChatResponse(
        session_id=session_id,
        route=route,  # type: ignore[arg-type]
        route_reason="demo-mode keyword heuristic" if _import_error else None,
        answer=answer,
        generated_sql=generated_sql,
        is_safe=is_safe,
        generated_code=generated_code,
        latency_ms=latency_ms,
        timestamp=_now(),
    )


def _now():
    from datetime import datetime, timezone

    return datetime.now(timezone.utc)
