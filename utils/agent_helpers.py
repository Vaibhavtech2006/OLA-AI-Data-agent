import json

def parse_tool_observation(observation: str):
    """
    Parses JSON output from tools to extract the message for the LLM 
    and extra metadata (like dataset_path or charts) for the graph state.
    """
    try:
        parsed = json.loads(observation)
        if isinstance(parsed, dict) and "message" in parsed:
            extras = {k: v for k, v in parsed.items() if k != "message"}
            return parsed["message"], extras
    except (json.JSONDecodeError, TypeError):
        pass
    return observation, {}