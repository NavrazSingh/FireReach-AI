# FireReach Documentation

## Architecture Explanation
FireReach follows a microservice-style design pattern consisting of a FastAPI backend and a React/Vite/Tailwind frontend. 
The backend exposes `POST /run-outreach` which orchestrates an Agent containing EXACTLY three tools in a strict sequence.

## Agent Reasoning Flow
1. **Harvester (`tool_signal_harvester`)**: Given a company name, queries SerpAPI and NewsAPI to deterministically pull live indicators (funding, hiring, tech stack, leadership). Returns JSON.
2. **Analyst (`tool_research_analyst`)**: Merges the User ICP definition with harvested signals. Injects this into the LLM (Llama3-70B) to establish a 2-paragraph strategic account brief detailing pain points and the context of their growth.
3. **Sender (`tool_outreach_automated_sender`)**: Generates an under-150-word targeted email addressing cybersecurity risks derived precisely from the account brief. It proceeds to dispatch it automatically via SMTP if credentials are provided. Default returns mock mode response if credentials are not configured.

## Tool Schemas
See `backend/tools/` for logic. Outputs rigidly map to JSON strings inside the LLM calls to prevent structure breaks.

## System Prompt
- For Analyst: `"You are a strategic account researcher. Provide exactly a 2-paragraph analysis. Explain signal growth, ICP fit, pain points, and solution relevance."`
- For Sender: `"You are an expert cybersecurity GTM outbound writer. Output pure JSON format without formatting ticks, containing 'email_subject' and 'email_body'. Keep body under 150 words."`
