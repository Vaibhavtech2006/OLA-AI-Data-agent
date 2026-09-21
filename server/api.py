import os
import sys
import shutil
import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agents.data_agent import data_agent 

app = FastAPI(title="Data Agent Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

# Naya Upload Endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        os.makedirs("data/uploads", exist_ok=True)
        file_path = f"data/uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"status": "success", "file_path": file_path, "filename": file.filename}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/execute")
async def execute_query(req: QueryRequest):
    try:
        response = data_agent.invoke({
            "messages": [HumanMessage(content=req.query)],
            "plan": [],
            "current_step": 0,
            "trace": [],
            "dataset_path": "",
            "chart_base64": ""
        })
        
        plan = response.get("plan", [])
        trace = response.get("trace", [])
        
        messages = response.get("messages", [])
        final_answer = "Execution complete, but no text summary was generated."
        if messages:
            last_message = messages[-1]
            if hasattr(last_message, 'content'):
                final_answer = last_message.content
            elif isinstance(last_message, dict) and "content" in last_message:
                final_answer = last_message["content"]
            else:
                final_answer = str(last_message)
        
        return {
            "status": "success",
            "plan_executed": plan,
            "trace": trace,
            "result": final_answer,
            "dataset_path": response.get("dataset_path", ""),
            "chart_base64": response.get("chart_base64", "")
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)