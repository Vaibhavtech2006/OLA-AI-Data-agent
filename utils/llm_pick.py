from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

def pick_llm(level: str):
    level = level.lower()

    if level == "low":
        return ChatGroq(
            model="openai/gpt-oss-20b",
            temperature=0
        )
    elif level == "medium":
        return ChatGroq(
            model="qwen/qwen3.6-27b",
            temperature=0
        )
    elif level == "hard":
        return ChatGroq(
            model="openai/gpt-oss-120b",
            temperature=0
        )
    else:
        raise ValueError(
            "Invalid Level. Choose from 'low', 'medium', or 'hard'."
        )