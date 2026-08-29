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

    
