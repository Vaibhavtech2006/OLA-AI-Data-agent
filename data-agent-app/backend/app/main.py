from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import chat, dashboard, history

settings = get_settings()

app = FastAPI(
    title="Data Agent API",
    description="REST layer in front of the SQL Analyst / ETL Analyst LangGraph agents.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(history.router)
app.include_router(dashboard.router)


@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "ok"}
