from typing import List, Literal
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage

# ==========================================
# ORIGINAL SCHEMAS (DO NOT DELETE)
# ==========================================

class ETLAgentSchema(BaseModel):
    messages: List[BaseMessage] = Field(default_factory=list)

    class Config:
        arbitrary_types_allowed = True

class AgentSchema(BaseModel):
    messages: List[BaseMessage] = Field(default_factory=list)
    user_question: str = ""
    curated_ques: str = ""
    prompt_query_context: str = ""
    generated_sql_query: str = ""
    is_safe: str = ""
    comments: str = ""
    sql_query_execution_result: str = ""
    final_answer: str = ""

    class Config:
        arbitrary_types_allowed = True

class JudgeSchema(BaseModel):
    answer: str = Field(description="Yes or No")
    comments: str = Field(description="Reasoning for the decision")

class RouterSchema(BaseModel):
    answer: str = Field(description="The routing destination: 'sql' or 'etl'")


# ==========================================
# NEW ENTERPRISE SCHEMAS 
# ==========================================

class PlannerSchema(BaseModel):
    steps: List[Literal["sql", "etl", "eda", "visualization", "ml", "forecasting"]] = Field(
        description=(
            "Ordered list of specialist agents. Add 'forecasting' if the user asks to "
            "predict future trends, forecast time-series data, or detect anomalies/outliers."
        )
    )

class DataAgentSchema(BaseModel):
    messages: List[BaseMessage] = Field(default_factory=list)
    plan: List[str] = Field(default_factory=list)
    current_step: int = 0
    trace: List[dict] = Field(default_factory=list)
    dataset_path: str = ""
    chart_base64: str = ""

    class Config:
        arbitrary_types_allowed = True

class EDAAgentSchema(BaseModel):
    messages: List[BaseMessage] = Field(default_factory=list)
    dataset_path: str = ""

    class Config:
        arbitrary_types_allowed = True

class VizAgentSchema(BaseModel):
    messages: List[BaseMessage] = Field(default_factory=list)
    dataset_path: str = ""
    chart_base64: str = ""

    class Config:
        arbitrary_types_allowed = True

class MLAgentSchema(BaseModel):
    messages: List[BaseMessage] = Field(default_factory=list)
    dataset_path: str = ""

    class Config:
        arbitrary_types_allowed = True

class ForecastingAgentSchema(BaseModel):
    messages: List[BaseMessage] = Field(default_factory=list)
    dataset_path: str = ""
    chart_base64: str = ""

    class Config:
        arbitrary_types_allowed = True