from fastapi import APIRouter, HTTPException

from app.models import ChatRequest, ChatResponse
from app.services.agent_service import run_agent
from app.services.store import history_store

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest) -> ChatResponse:
    try:
        result = await run_agent(payload.message, payload.session_id or "default")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {exc}") from exc

    history_store.add(
        session_id=result.session_id,
        route=result.route,
        user_question=payload.message,
        answer=result.answer,
        latency_ms=result.latency_ms,
        is_safe=result.is_safe,
    )
    return result
