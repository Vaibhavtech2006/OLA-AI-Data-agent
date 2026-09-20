import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.llm_pick import pick_llm
from utils.forecasting_tools import ForecastingTools
from utils.agent_helpers import parse_tool_observation
from models.schema import DataAgentSchema
from langchain_core.messages import ToolMessage, HumanMessage
from langgraph.graph import StateGraph, START, END
from langchain.tools import tool

@tool
def time_series_forecast_tool(file_path: str, time_column: str, target_column: str, periods: int = 30) -> str:
    """
    Analyzes historical time-series data and predicts future values.
    
    Args:
        file_path (str): Path to the CSV/JSON/Parquet file containing historical data.
        time_column (str): The column containing dates or timestamps.
        target_column (str): The numerical column to forecast.
        periods (int): Number of future periods (days) to forecast. Defaults to 30.
    """
    return ForecastingTools().forecast_time_series(file_path, time_column, target_column, periods)

tools = [time_series_forecast_tool]

llm = pick_llm("hard")
llm_bind = llm.bind_tools(tools)

def llm_node(state: DataAgentSchema):
    messages = state.messages

    prompt = f"""
            You are a Quantitative Forecasting Analyst. You have access to a robust time-series
            forecasting tool that handles trend and seasonality. Extract the required parameters 
            (time column, target column, periods) from the user's request and the provided dataset path.
            Once the forecast is generated, provide a concise executive summary of the anticipated trend 
            and end the conversation.
            
            Chat history: {messages}
    """

    final_answer = llm_bind.invoke(prompt)
    state.messages = messages + [final_answer]

    return state

def tool_node(state: DataAgentSchema):
    tools_results = []
    tools_by_name = {tool.name: tool for tool in tools}
    tool_calls = state.messages[-1].tool_calls

    for tool_call in tool_calls:
        tool_func = tools_by_name[tool_call['name']]
        raw_observation = tool_func.invoke(tool_call['args'])
        message, extras = parse_tool_observation(raw_observation)

        if "chart_base64" in extras:
            state.chart_base64 = extras["chart_base64"]
        if "output_path" in extras:
            state.dataset_path = extras["output_path"]

        tools_results.append(ToolMessage(content=message, tool_call_id=tool_call['id']))

    state.messages = state.messages + tools_results

    return state

forecasting_analyst_graph = StateGraph(DataAgentSchema)
forecasting_analyst_graph.add_node("llm_node", llm_node)
forecasting_analyst_graph.add_node("tool_node", tool_node)

forecasting_analyst_graph.add_edge(START, "llm_node")

def is_tool_call(state: DataAgentSchema):
    tool_calls = state.messages[-1].tool_calls
    if tool_calls:
        return "tool_node"
    else:
        return "end"

forecasting_analyst_graph.add_conditional_edges(
    "llm_node", is_tool_call,
    {
        "tool_node": "tool_node",
        "end": END
    }
)

forecasting_analyst_graph.add_edge("tool_node", "llm_node")

forecasting_analyst = forecasting_analyst_graph.compile()