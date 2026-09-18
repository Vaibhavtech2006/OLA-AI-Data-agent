from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

def pick_llm(level: str):
    level = level.lower()

    if level == "low":
        return ChatGroq(
            model="openai/gpt-oss-20b",
            temperature=0,
            max_tokens=800
        )
    elif level == "medium":
        return ChatGroq(
            model="qwen/qwen3.8-27b",
            temperature=0,
            max_tokens=800
        )
    elif level == "hard":
        return ChatGroq(
            model="openai/gpt-oss-120b",
            temperature=0,
            max_tokens=800
        )
    elif level == "grok":
        # Using Llama 3.1 8B for the grok fallback as per your earlier ETL setup
        return ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0,
            max_tokens=800
        )
    else:
        raise ValueError(
            "Invalid Level. Choose from 'low', 'medium', 'hard', or 'grok'."
        )