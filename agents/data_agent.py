import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agents import sql_analyst
from utils.llm_pick import pick_llm
from models.schema import RouterSchema, DataAgentSchema
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from agents.etl_analyst import etl_analyst
from agents.sql_analyst import sql_analyst

# Pick LLM and attach structured output
llm = pick_llm("hard")
llm_router = llm.with_structured_output(RouterSchema)


# ---------------------------- DATA AGENT GRAPH ---------------------------- #

def router_node(state: DataAgentSchema):
    message = state.messages[-1].content

    # Provide a strict prompt so the structured output model reliably returns the schema
    system_prompt = (
        "You are a routing assistant. Classify whether the user's question is related to 'sql' "
        "or 'etl' operations. You must choose either 'sql' or 'etl' for the answer."
    )
    
    router_input = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=message)
    ]

    route_response_dict = llm_router.invoke(router_input).model_dump()
    route_response = route_response_dict['answer']

    state.route_response = route_response
    return state


def etl_node(state: DataAgentSchema):
    message = state.messages[-1].content

    response = etl_analyst.invoke({
        "messages": [HumanMessage(content=f"{message}")]
    })
    
    state.messages = state.messages + [response]
    return state


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
    state.messages = state.messages + [response]
    return state


# Build Graph
data_agent_graph = StateGraph(DataAgentSchema)

data_agent_graph.add_node("router_node", router_node)
data_agent_graph.add_node("etl_node", etl_node)
data_agent_graph.add_node("sql_node", sql_node)

data_agent_graph.add_edge(START, "router_node")

def route_edge(state: DataAgentSchema) -> str:
    if state.route_response == "sql":
        return "sql_node"
    elif state.route_response == "etl":
        return "etl_node"
    else:
        raise ValueError(f"Invalid route response: {state.route_response}")

data_agent_graph.add_conditional_edges(
    "router_node", 
    route_edge,
    {
        "sql_node": "sql_node",
        "etl_node": "etl_node"
    }
)

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
    response = data_agent.invoke({
        "messages": [
            HumanMessage(content="I want to extract the data from the API endpoint 'https://pokeapi.co/api/v2/pokemon' and save it to data/extract folder in the csv folder")
        ],
        "route_response": ""
    })

    print(response)