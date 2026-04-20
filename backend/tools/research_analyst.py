import json
from backend.llm import generate_completion

def tool_research_analyst(icp: str, signals: dict) -> dict:
    """
    Generates a strategic account brief.
    Output must be a 2 paragraph analysis.
    """
    sys_prompt = "You are a strategic account researcher. Provide exactly a 2-paragraph analysis. Explain signal growth, ICP fit, pain points, and solution relevance."
    prompt = f"""
    ICP: {icp}
    Signals: {json.dumps(signals, indent=2)}
    
    Generate a 2-paragraph account brief explaining:
    1. What signals indicate about the company's growth
    2. Why this company fits the ICP
    3. What pain points they may have
    4. Why the solution is relevant
    """
    messages = [
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": prompt}
    ]
    
    analysis = generate_completion(messages, max_tokens=1500)
    
    return {
        "account_brief": analysis.strip()
    }
