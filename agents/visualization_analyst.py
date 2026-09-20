import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.llm_pick import pick_llm
from utils.viz_tools import VizTools
from utils.agent_helpers import parse_tool_observation
from models.schema import VizAgentSchema
from langchain_core.messages import ToolMessage, HumanMessage
from langgraph.graph import StateGraph, START, END
from langchain.tools import tool

@tool
def generate_chart_tool(file_path: str, chart_type: str, x_column: str, y_column: str = None, title: str = "") -> str:
    """Generates a chart from a dataset and returns it as a base64-encoded PNG."""
    return VizTools().generate_chart(file_path, chart_type, x_column, y_column, title)

tools = [generate_chart_tool]
llm = pick_llm("hard").bind_tools(tools)

def llm_node(state: VizAgentSchema):
    prompt = f"You are a Data Visualization Analyst. Pick the best chart type to answer the user's question using the dataset path. \nChat history: {state.messages}"
    state.messages.append(llm.invoke(prompt))
    return state

def tool_node(state: VizAgentSchema):
    tools_by_name = {tool.name: tool for tool in tools}
    for tool_call in state.messages[-1].tool_calls:
        raw_obs = tools_by_name[tool_call['name']].invoke(tool_call['args'])
        msg, extras = parse_tool_observation(raw_obs)
        if "chart_base64" in extras: state.chart_base64 = extras["chart_base64"]
        if "output_path" in extras: state.dataset_path = extras["output_path"]
        state.messages.append(ToolMessage(content=msg, tool_call_id=tool_call['id']))
    return state

graph = StateGraph(VizAgentSchema)
graph.add_node("llm_node", llm_node)
graph.add_node("tool_node", tool_node)
graph.add_edge(START, "llm_node")
graph.add_conditional_edges("llm_node", lambda s: "tool_node" if s.messages[-1].tool_calls else "end", {"tool_node": "tool_node", "end": END})
graph.add_edge("tool_node", "llm_node")
visualization_analyst = graph.compile()