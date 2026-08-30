import os
import sys


sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from utils.llm_pick import pick_llm
from utils.database import DatabaseUtil
from Models.schema import AgentSchema
import langchain_core.messages import HumanMessgae


#-------------------AI Agent code------------------------------

def curate_question(state: AgentSchema) -> AgentSchema:

    user_question = state.user_question 
    llm = pick_llm("low")
    response = llm.invoke(f"Curate the following question : {user_question}")

    state.curated_ques = response
    state.messages =state.messages +[HumanMessage(content=f"{response}")]
    return state


def prompt_query_context(state: AgentSchema) -> AgentSchema:

    curated_question = state.curated_ques

    conn_details = {
        "host" :os.environ['host'],
        "port": os.environ['port'],
        "user": os.environ['user'],
        "password":os.environ['password'],
        "dbname": os.environ['dbname']
    }

    obj = DatabaseUtil(conn_details)

    schema_info = obj.schema_details("public")

      # Constructing the prompt query for the agent to generate the SQL query
    prompt = f"""
    You are an SQL analyst agent. Your task is to convert the user's natural language 
    query into Postgres SQL query that can be executed on the database. You are provided 
    with the user's original query and the schema details of the database, including
    table names, column names, data types, and sample data for each table so that 
    you can understand the structure of the database and generate an accurate SQL query.
    Unless user explicitly asks for specific number of rows, always limit the output to 10 rows.
    Note - Just generate the SQL query without any explanation or additional text because
    this query will be executed directly on the database. So, the output should be SQL
    ready to be executed without any modifications.  
    
    User's Original Query: {curated_question}

    Database Schema Details:
    {schema_info}
    
    """    

    state.prompt_query_context = prompt

    return state



    


    
