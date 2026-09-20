import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.llm_pick import pick_llm
from utils.ml_tools import MLTools
from utils.agent_helpers import parse_tool_observation
from models.schema import MLAgentSchema
from langchain_core.messages import ToolMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langchain.tools import tool

@tool
def train_model_tool(file_path: str, target_column: str, model_type: str = "auto") -> str:
    """Trains a baseline RandomForest model on a dataset and reports metrics."""
    return MLTools().train_model(file_path, target_column, model_type)

tools = [train_model_tool]
llm = pick_llm("hard").bind_tools(tools)

def llm_node(state: MLAgentSchema):
    # Use a strict SystemMessage to force tool usage
    system_prompt = SystemMessage(
        content=(
            "You are an ML Analyst. You MUST use the 'train_model_tool' to train a model. "
            "Extract the dataset file path and the target column to predict directly from the user's prompt. "
            "Do NOT ask the user for clarification or file paths—execute the tool immediately with the provided information."
        )
    )
    
    # Pass the system prompt along with the actual message history
    input_messages = [system_prompt] + state.messages
    
    response = llm.invoke(input_messages)
    state.messages.append(response)
    return state

def tool_node(state: MLAgentSchema):
    tools_by_name = {tool.name: tool for tool in tools}
    for tool_call in state.messages[-1].tool_calls:
        raw_obs = tools_by_name[tool_call['name']].invoke(tool_call['args'])
        msg, extras = parse_tool_observation(raw_obs)
        if "output_path" in extras: state.dataset_path = extras["output_path"]
        state.messages.append(ToolMessage(content=msg, tool_call_id=tool_call['id']))
    return state

graph = StateGraph(MLAgentSchema)
graph.add_node("llm_node", llm_node)
graph.add_node("tool_node", tool_node)
graph.add_edge(START, "llm_node")
graph.add_conditional_edges(
    "llm_node", 
    lambda s: "tool_node" if s.messages[-1].tool_calls else "end", 
    {"tool_node": "tool_node", "end": END}
)
graph.add_edge("tool_node", "llm_node")
ml_analyst = graph.compile()