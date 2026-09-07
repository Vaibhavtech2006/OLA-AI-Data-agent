"""
Lightweight in-memory store for query history + dashboard stats.

This keeps the reference implementation dependency-free and easy to run.
For a real production deployment, swap this for a table in the same
Postgres database the SQL Analyst agent already talks to (see
utils/database.py in the root project) — the interface below
(add / list / stats) is designed to map 1:1 onto a simple SQL table.
"""
from collections import deque
from datetime import datetime, timezone
from statistics import mean
from typing import Deque, Literal, Optional
from uuid import uuid4

from app.config import get_settings
from app.models import HistoryItem, StatsResponse

settings = get_settings()


class HistoryStore:
    def __init__(self, max_items: int = 500):
        self._items: Deque[HistoryItem] = deque(maxlen=max_items)

    def add(
        self,
        session_id: str,
        route: Literal["sql", "etl", "unknown"],
        user_question: str,
        answer: str,
        latency_ms: int,
        is_safe: Optional[Literal["Yes", "No"]] = None,
    ) -> HistoryItem:
        item = HistoryItem(
            id=str(uuid4()),
            session_id=session_id,
            route=route,
            user_question=user_question,
            answer=answer,
            is_safe=is_safe,
            latency_ms=latency_ms,
            timestamp=datetime.now(timezone.utc),
        )
        self._items.appendleft(item)
        return item

    def list(self, limit: int = 50) -> list[HistoryItem]:
        return list(self._items)[:limit]

    def stats(self) -> StatsResponse:
        items = list(self._items)
        total = len(items)
        sql_count = sum(1 for i in items if i.route == "sql")
        etl_count = sum(1 for i in items if i.route == "etl")
        blocked = sum(1 for i in items if i.is_safe == "No")
        avg_latency = int(mean([i.latency_ms for i in items])) if items else 0

        buckets: dict[str, int] = {}
        for i in items:
            key = i.timestamp.strftime("%H:00")
            buckets[key] = buckets.get(key, 0) + 1
        by_hour = [{"hour": h, "count": c} for h, c in sorted(buckets.items())]

        return StatsResponse(
            total_queries=total,
            sql_queries=sql_count,
            etl_queries=etl_count,
            blocked_unsafe=blocked,
            avg_latency_ms=avg_latency,
            queries_by_hour=by_hour,
        )


history_store = HistoryStore(max_items=settings.history_limit)
