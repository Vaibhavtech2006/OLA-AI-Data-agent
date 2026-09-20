import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.llm_pick import pick_llm
from models.schema import DataAgentSchema, PlannerSchema
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langgraph.graph import StateGraph, START, END

# Import all specialist agents
from agents.etl_analyst import etl_analyst
from agents.sql_analyst import sql_analyst
from agents.eda_analyst import eda_analyst
from agents.visualization_analyst import visualization_analyst
from agents.ml_analyst import ml_analyst
from agents.forecasting_analyst import forecasting_analyst

llm = pick_llm("hard")
llm_planner = llm.with_structured_output(PlannerSchema)

AGENT_NAMES = {
    "sql": "SQL Analyst",
    "etl": "ETL Analyst",
    "eda": "EDA Analyst",
    "visualization": "Visualization Analyst",
    "ml": "ML Analyst",
    "forecasting": "Time-Series Analyst",
}


# ---------------------------- PLANNER NODE ---------------------------- #

def planner_node(state: DataAgentSchema):
    message = state.messages[-1].content

    system_prompt = (
        "You are a planning assistant for an enterprise multi-agent data platform. Break the "
        "user's request into an ordered list of steps, choosing from: 'sql', 'etl', "
        "'eda', 'visualization', 'ml', 'forecasting'.\n\n"
        "- 'sql': answering questions using the Postgres database\n"
        "- 'etl': extracting data from an API/URL, or transforming/cleaning a file\n"
        "- 'eda': profiling a dataset - summary stats, correlations, missing values, outliers\n"
        "- 'visualization': producing a chart from a dataset\n"
        "- 'ml': training a classification or regression model, generating predictions\n"
        "- 'forecasting': predicting future trends in time-series data or detecting anomalies\n\n"
        "Only include the steps actually needed. If a later step needs a dataset produced "
        "by an earlier step (e.g. 'etl' then 'forecasting'), put them in the right order."
    )

    planner_input = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=message),
    ]

    plan = llm_planner.invoke(planner_input)

    state.plan = plan.steps
    state.current_step = 0
    state.trace = [{
        "step": "Planner",
        "detail": f"Execution Plan: {' -> '.join(AGENT_NAMES[s] for s in plan.steps)}",
        "status": "success",
    }]
    return state


def dispatch_edge(state: DataAgentSchema) -> str:
    if state.current_step >= len(state.plan):
        return "end"
    return state.plan[state.current_step]


def _run_agent(state: DataAgentSchema, agent, agent_key: str):
    message = state.messages[-1].content
    dataset_context = f"\n\nMost recent dataset path: {state.dataset_path}" if state.dataset_path else ""

    response = agent.invoke({
        "messages": [HumanMessage(content=f"{message}{dataset_context}")]
    })

    last_msg = response["messages"][-1]
    state.messages = state.messages + [last_msg]

    if response.get("dataset_path"):
        state.dataset_path = response["dataset_path"]
    if response.get("chart_base64"):
        state.chart_base64 = response["chart_base64"]

    state.trace = state.trace + [{
        "step": AGENT_NAMES[agent_key],
        "detail": str(last_msg.content)[:160] + ("..." if len(str(last_msg.content)) > 160 else ""),
        "status": "success",
    }]
    state.current_step += 1
    return state


# ---------------------------- SPECIALIST NODES ---------------------------- #

def etl_node(state: DataAgentSchema):
    return _run_agent(state, etl_analyst, "etl")

def eda_node(state: DataAgentSchema):
    return _run_agent(state, eda_analyst, "eda")

def visualization_node(state: DataAgentSchema):
    return _run_agent(state, visualization_analyst, "visualization")

def ml_node(state: DataAgentSchema):
    return _run_agent(state, ml_analyst, "ml")

def forecasting_node(state: DataAgentSchema):
    return _run_agent(state, forecasting_analyst, "forecasting")

def sql_node(state: DataAgentSchema):
    message = state.messages[-1].content

    input_schema = {
        "messages": [],
        "user_question": f"{message}",
        "curated_ques": "",
        "prompt_query_context": "",
        "generated_sql_query": "",
        "is_safe": "No",
        "comments": "",
        "sql_query_execution_result": "",
        "final_answer": ""
    }

    response = sql_analyst.invoke(input_schema)
    final_output = response.get("final_answer", "SQL Execution Complete")
    
    state.messages = state.messages + [AIMessage(content=final_output)]
    state.trace = state.trace + [{
        "step": "SQL Analyst",
        "detail": response.get("generated_sql_query", "Executed database query")[:160],
        "status": "success",
    }]
    state.current_step += 1
    return state


# ---------------------------- BUILD GRAPH ---------------------------- #

data_agent_graph = StateGraph(DataAgentSchema)

data_agent_graph.add_node("planner_node", planner_node)
data_agent_graph.add_node("sql_node", sql_node)
data_agent_graph.add_node("etl_node", etl_node)
data_agent_graph.add_node("eda_node", eda_node)
data_agent_graph.add_node("visualization_node", visualization_node)
data_agent_graph.add_node("ml_node", ml_node)
data_agent_graph.add_node("forecasting_node", forecasting_node)

data_agent_graph.add_edge(START, "planner_node")

route_map = {
    "sql": "sql_node",
    "etl": "etl_node",
    "eda": "eda_node",
    "visualization": "visualization_node",
    "ml": "ml_node",
    "forecasting": "forecasting_node",
    "end": END,
}

for node_name in ["planner_node", "sql_node", "etl_node", "eda_node", "visualization_node", "ml_node", "forecasting_node"]:
    data_agent_graph.add_conditional_edges(node_name, dispatch_edge, route_map)

data_agent = data_agent_graph.compile()

# Optional: Draw graph visualization
try:
    from IPython.display import Image
    img = Image(data_agent.get_graph().draw_mermaid_png())
    with open("data_agent_graph.png", "wb") as f:
        f.write(img.data)
except Exception as e:
    print(f"Could not generate graph visualization: {e}")


if __name__ == "__main__":
    # Test execution for the pipeline
    test_response = data_agent.invoke({
        "messages": [
            HumanMessage(content="Extract the latest sales data, run an EDA profile, and forecast the next 30 days.")
        ],
        "plan": [],
        "current_step": 0,
        "trace": [],
        "dataset_path": "",
        "chart_base64": ""
    })

    print(test_response)