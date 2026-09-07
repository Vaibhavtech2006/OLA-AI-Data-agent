"""
App-wide configuration, loaded from environment variables (.env).
Mirrors the variables already used by the existing Data_Agent project
(see the root README: ANTHROPIC_API_KEY, host, port, user, password, database).
"""
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LLM providers
    anthropic_api_key: str = ""
    openai_api_key: str = ""

    # Postgres (used by the SQL Analyst agent)
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = ""
    db_name: str = "data_agent_db"

    # API server
    cors_origins: list[str] = ["http://localhost:5173"]
    history_limit: int = 200

    class Config:
        env_file = ".env"
        env_prefix = ""
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
