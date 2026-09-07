from fastapi import APIRouter, Query

from app.models import HistoryItem
from app.services.store import history_store

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=list[HistoryItem])
async def get_history(limit: int = Query(default=50, ge=1, le=200)) -> list[HistoryItem]:
    return history_store.list(limit=limit)
