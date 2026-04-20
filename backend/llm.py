from groq import Groq
from backend.config import GROQ_API_KEY

def get_llm_client():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set. Please set it in the .env file.")
    return Groq(api_key=GROQ_API_KEY)

def generate_completion(messages, model="llama-3.3-70b-versatile", temperature=0.7, max_tokens=1000):
    client = get_llm_client()
    try:
        response = client.chat.completions.create(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating LLM completion: {e}")
        return f"Error: {str(e)}"
