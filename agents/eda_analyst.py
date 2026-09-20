import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.llm_pick import pick_llm
from utils.eda_tools import EDATools
from utils.agent_helpers import parse_tool_observation
from models.schema import EDAAgentSchema
from langchain_core.messages import ToolMessage, HumanMessage
from langgraph.graph import StateGraph, START, END
from langchain.tools import tool

@tool
def profile_dataset_tool(file_path: str) -> str:
    """Profiles a dataset: shape, column types, missing values, and summary stats."""
    return EDATools().profile_dataset(file_path)

@tool
def correlation_matrix_tool(file_path: str) -> str:
    """Computes the correlation matrix between numeric columns."""
    return EDATools().correlation_matrix(file_path)

@tool
def detect_outliers_tool(file_path: str, column: str) -> str:
    """Detects outliers in a numeric column using the IQR method."""
    return EDATools().detect_outliers(file_path, column)

@tool
def missing_value_report_tool(file_path: str) -> str:
    """Reports missing values per column."""
    return EDATools().missing_value_report(file_path)

tools = [profile_dataset_tool, correlation_matrix_tool, detect_outliers_tool, missing_value_report_tool]
llm = pick_llm("hard").bind_tools(tools)

def llm_node(state: EDAAgentSchema):
    prompt = f"You are a Data Analyst who performs exploratory data analysis (EDA). Use the tools to analyze the dataset path provided. Summarize the findings.\nChat history: {state.messages}"
    state.messages.append(llm.invoke(prompt))
    return state

def tool_node(state: EDAAgentSchema):
    tools_by_name = {tool.name: tool for tool in tools}
    for tool_call in state.messages[-1].tool_calls:
        raw_obs = tools_by_name[tool_call['name']].invoke(tool_call['args'])
        msg, extras = parse_tool_observation(raw_obs)
        if "output_path" in extras:
            state.dataset_path = extras["output_path"]
        state.messages.append(ToolMessage(content=msg, tool_call_id=tool_call['id']))
    return state

graph = StateGraph(EDAAgentSchema)
graph.add_node("llm_node", llm_node)
graph.add_node("tool_node", tool_node)
graph.add_edge(START, "llm_node")
graph.add_conditional_edges("llm_node", lambda s: "tool_node" if s.messages[-1].tool_calls else "end", {"tool_node": "tool_node", "end": END})
graph.add_edge("tool_node", "llm_node")
eda_analyst = graph.compile()