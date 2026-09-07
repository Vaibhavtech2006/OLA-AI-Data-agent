from fastapi import APIRouter

from app.models import StatsResponse
from app.services.store import history_store

router = APIRouter(prefix="/api/stats", tags=["dashboard"])


@router.get("", response_model=StatsResponse)
async def get_stats() -> StatsResponse:
    return history_store.stats()
