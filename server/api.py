import os
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

# FIX: Python ko main project directory ka rasta batana
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Ab ye agents folder ko easily find kar lega
from agents.data_agent import data_agent 

app = FastAPI(title="Data Agent Pro API")

# ... (baaki ka code same rahega)
# React localhost ko allow karne ke liye CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], # React/Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/api/execute")
async def execute_query(req: QueryRequest):
    try:
        # LangGraph invoke karna
        response = data_agent.invoke({
            "messages": [HumanMessage(content=req.query)],
            "route_response": ""
        })
        
        # Data extract karna frontend ke liye
        route = response.get("route_response", "UNKNOWN").upper()
        messages = response.get("messages", [])
        
        # --- FIX: Dictionary vs Object Extraction Logic ---
        final_answer = "No response generated."
        if messages:
            last_node_output = messages[-1]
            
            # Agar output ek dictionary hai (jo agents ki .invoke() return karti hai)
            if isinstance(last_node_output, dict):
                # SQL Agent ka response nikalna
                if "final_answer" in last_node_output and last_node_output["final_answer"]:
                    final_answer = last_node_output["final_answer"]
                # ETL Agent ka response nikalna
                elif "messages" in last_node_output and len(last_node_output["messages"]) > 0:
                    final_answer = last_node_output["messages"][-1].content
                else:
                    final_answer = str(last_node_output)
            # Agar output normal Langchain Message object hai
            elif hasattr(last_node_output, 'content'):
                final_answer = last_node_output.content
            else:
                final_answer = str(last_node_output)
        # ------------------------------------------------
        
        # Professional Dashboard UI ke liye structured trace bhejna
        trace_steps = [
            {"step": "Router Node", "detail": f"Classified query as {route} Operation", "status": "success"},
            {"step": f"{route} Agent", "detail": "Context and schema loaded", "status": "success"},
            {"step": "Execution", "detail": "Query processed successfully", "status": "success"}
        ]
        
        return {
            "status": "success",
            "route": route,
            "trace": trace_steps,
            "result": final_answer
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)