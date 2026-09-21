# 🚀 OLA.AI Data Agent (Enterprise Multi-Agent Platform)

**OLA.AI Data Agent** is an autonomous, enterprise-grade data analytics platform powered by LangGraph, FastAPI, and React. It acts as an intelligent router that understands user intent and dynamically delegates tasks across a cluster of specialized worker agents (SQL, ETL, ML, Time-Series, RAG).

This project demonstrates a complete implementation of an agentic architecture featuring an IDE-style React workspace, natural language routing, safe code execution, and dynamic LLM fallback systems.

---

## 📋 Table of Contents
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Agent Descriptions](#-agent-descriptions)
- [Data Models (State Management)](#-data-models)
- [Usage & Examples](#-usage--examples)
- [Security Features](#-security-features)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture

The system follows a hierarchical LangGraph multi-agent architecture:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Data Agent (Planner/Router)                     │
│         Analyzes query intent and dynamically generates a graph        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
         ┌──────────┬──────────┬─────┴────┬──────────┬──────────┐
         ▼          ▼          ▼          ▼          ▼          ▼
    ┌───────┐  ┌───────┐  ┌────────┐  ┌───────┐  ┌───────┐  ┌───────┐
    │  SQL  │  │  ETL  │  │  Data  │  │  ML   │  │ Time- │  │  RAG  │
    │ Agent │  │ Agent │  │Profiler│  │ Agent │  │ Series│  │ Agent │
    └───────┘  └───────┘  └────────┘  └───────┘  └───────┘  └───────┘
         │          │          │          │          │          │
         │          │          │          │          │          │
         ▼          ▼          ▼          ▼          ▼          ▼
    PostgreSQL  API/JSON    Pandas   Scikit-Learn Prophet   ChromaDB

1. Clone the Repository
Bash
git clone [https://github.com/Vaibhavtech2006/OLA-AI-Data-agent.git](https://github.com/Vaibhavtech2006/OLA-AI-Data-agent.git)
cd OLA-AI-Data-agent

2. Backend Setup (FastAPI + LangGraph)
Bash
python -m venv .venv
# On Windows: .\.venv\Scripts\activate
# On Mac/Linux: source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn langchain-groq langgraph pandas scikit-learn prophet matplotlib python-dotenv langchain-chroma langchain-huggingface sentence-transformers python-multipart psycopg2 pydantic

# Start the API Server
python api.py
3. Frontend Setup (React)
3. Frontend Setup (React)
Bash
cd frontend
npm install
npm start
📁 Project Structure
Plaintext
OLA-AI-Data-agent/
├── agents/                  # AI specialized agents
│   ├── data_agent.py        # Main router/planner agent
│   ├── sql_analyst.py       # SQL querying agent
│   ├── etl_analyst.py       # API extraction & transformation
│   ├── ml_analyst.py        # Machine Learning operations
│   └── rag_analyst.py       # Vector knowledge retrieval
├── Models/                  # Pydantic schemas for state management
│   └── schema.py            
├── utils/                   # Toolkits & Utilities
│   ├── database.py          # PostgreSQL driver
│   ├── llm_pick.py          # Dynamic LLM routing logic
│   └── rag_tools.py         # ChromaDB and Embeddings
├── data/                    # Local storage volumes
│   ├── uploads/             # Datasets uploaded via React UI
│   └── chroma_db/           # Persistent vector storage
├── frontend/                # React.js IDE Dashboard Workspace
├── api.py                   # FastAPI backend & webhooks
└── README.md                # Project documentation
🤖 Agent Descriptions
1. SQL Analyst Agent
Converts natural language queries to SQL.

Fetches database schema details automatically.

Safety check: Validates query safety and prevents execution of dangerous commands (INSERT, DROP, DELETE).

2. ETL Analyst Agent
Handles data extraction from APIs.

Generates Pandas code for complex data transformations.

Executes code safely in a controlled environment.

3. Knowledge RAG Analyst
Uses HuggingFaceEmbeddings and ChromaDB.

Retrieves relevant business definitions, KPI formulas, and data dictionary contexts before allowing other agents to process data.

📊 Data Models (State Management)
AgentSchema (Generic & SQL State)
Python
class AgentSchema(BaseModel):
    messages: List                    # Conversation history & Tool calls
    user_question: str                # Original query
    generated_sql_query: str          # Generated code/SQL
    is_safe: Literal["Yes", "No"]     # Safety validation flag
    sql_query_execution_result: str   # Output from the tool execution
    dataset_path: str                 # Path to active file/volume
    chart_base64: str                 # Rendered visual output
RouterSchema (Query Classification)
Python
class RouterSchema(BaseModel):
    answer: Literal["sql", "etl", "ml", "rag", "viz"] 
    comments: str                     # Reasoning for routing decision
💻 Usage & Examples
Example 1: Database Query (SQL Analyst)
Input: "Show me the top 5 users with the highest ratings"

Router classifies as sql.

Fetches schema & generates: SELECT user_name FROM users ORDER BY rating DESC LIMIT 5.

Validates safety ✓ and executes.

Example 2: Data Extraction & Analysis (ETL + EDA)
Input: "Extract data from 'https://pokeapi.co/api/v2/pokemon', save as CSV, and run an EDA profile."

Router classifies as etl -> eda.

ETL Agent extracts JSON and converts to CSV.

Data Profiler Agent reads the new CSV and outputs statistical insights.

Example 3: RAG Retrieval
Input: "What is the company formula for calculating churn rate?"

Router classifies as rag.

RAG Agent performs semantic search in ChromaDB.

Synthesizes official documentation into the final answer.

🔐 Security Features
✅ SQL Safety Validation: Blocks destructive DB operations (DROP, ALTER, DELETE).

✅ Dynamic API Limits: Catches API 429/404 errors and dynamically falls back to active, free-tier LLM models.

✅ Sandboxed Context: RAG agent prevents LLM hallucinations by enforcing strict reliance on company vector data.

✅ Environment Security: .env isolation for all database passwords and Groq/OpenAI tokens.

📝 Environment Variables
Create a .env file in the root directory:

Code snippet
# AI APIs
GROQ_API_KEY=gsk_your_groq_api_key_here
# OPENAI_API_KEY=sk-optional-key

# PostgreSQL Configuration
host=localhost
port=5432
user=postgres
password=your_db_password
database=data_agent_db
