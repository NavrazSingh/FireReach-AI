# FireReach - Autonomous Outreach Engine

FireReach is a full-stack, autonomous sales outreach engine powered by Groq LLMs. It executes a strict 4-step pipeline:
1. deterministic signal harvesting (SerpAPI, NewsAPI).
2. account brief generation utilizing LLMs.
3. tailored email generation connecting signals with cybersecurity.
4. automatic SMTP dispatch.

## Quickstart

### Prerequisites
- Python 3.9+
- Node.js 18+

### Environment variables
Copy `.env.example` to `.env` and fill in your keys:
- `GROQ_API_KEY`
- `SERPAPI_KEY`
- `NEWSAPI_KEY`
- `SMTP_EMAIL` and `SMTP_PASSWORD` (use Mock mode if these are empty).

### Running Locally

1. **Backend**
   ```bash
   pip install -r backend/requirements.txt
   uvicorn backend.main:app --reload --port 8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open display link output from Vite in your browser.
