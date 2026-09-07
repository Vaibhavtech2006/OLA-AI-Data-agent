from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's natural language query")
    session_id: Optional[str] = Field(default="default", description="Conversation/session identifier")


class ChatResponse(BaseModel):
    session_id: str
    route: Literal["sql", "etl", "unknown"]
    route_reason: Optional[str] = None
    answer: str
    generated_sql: Optional[str] = None
    is_safe: Optional[Literal["Yes", "No"]] = None
    generated_code: Optional[str] = None
    latency_ms: int
    timestamp: datetime


class HistoryItem(BaseModel):
    id: str
    session_id: str
    route: Literal["sql", "etl", "unknown"]
    user_question: str
    answer: str
    is_safe: Optional[Literal["Yes", "No"]] = None
    latency_ms: int
    timestamp: datetime


class StatsResponse(BaseModel):
    total_queries: int
    sql_queries: int
    etl_queries: int
    blocked_unsafe: int
    avg_latency_ms: int
    queries_by_hour: list[dict]
