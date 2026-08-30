import os
import sys

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from utils.llm_pick import pick_llm
from Models.schema import AgentSchema


#-------------------AI Agent code------------------------------

def curate_question(state: AgentSchema) -> AgentSchema:

    user_question = state.user_question 
    llm = pick_llm("low")
    response = llm.invoke(f"Curate the following question : {user_question}")

    state.curated_ques = response
    return state.curated_ques


def prompt_query_context(state: AgentSchema) -> AgentSchema:

    curated_question = state.curated_ques

    


    
