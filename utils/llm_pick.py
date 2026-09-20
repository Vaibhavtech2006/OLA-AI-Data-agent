import os
import requests
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

def get_valid_groq_model():
    """Dynamically fetches a valid, active model allowed for your specific API key."""
    api_key = os.environ.get("GROQ_API_KEY")
    url = "https://api.groq.com/openai/v1/models"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            models = response.json().get("data", [])
            # Find the first valid text model (excluding audio/whisper models)
            for m in models:
                model_id = m.get("id", "")
                if "whisper" not in model_id.lower():
                    print(f"✅ Automatically selected active model: {model_id}")
                    return model_id
    except Exception as e:
        print(f"Failed to fetch models dynamically: {e}")
        
    # Ultimate fallback if the API call fails
    return "mixtral-8x7b-32768"

# Fetch the model once when the file loads
ACTIVE_MODEL = get_valid_groq_model()

def pick_llm(level: str):
    return ChatGroq(
        model=ACTIVE_MODEL,
        temperature=0,
        max_tokens=800
    )