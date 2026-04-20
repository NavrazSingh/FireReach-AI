import requests
from serpapi import GoogleSearch
from backend.config import SERPAPI_KEY, NEWSAPI_KEY

def tool_signal_harvester(company: str) -> dict:
    """
    Collects deterministic signals for a company.
    """
    signals = {
        "company": company,
        "funding": "not found",
        "hiring_trend": "not found",
        "leadership_changes": "not found",
        "tech_stack": [],
        "news_mentions": [],
        "growth_signals": []
    }
    
    # NewsAPI
    if NEWSAPI_KEY:
        try:
            news_url = f"https://newsapi.org/v2/everything?q={requests.utils.quote(company)}&sortBy=relevancy&apiKey={NEWSAPI_KEY}"
            res = requests.get(news_url, timeout=5)
            if res.status_code == 200:
                articles = res.json().get("articles", [])[:3]
                signals["news_mentions"] = [a.get("title") for a in articles]
        except Exception:
            pass

    # SerpAPI Search for Funding / Hiring / Leadership
    if SERPAPI_KEY:
        try:
            search = GoogleSearch({
                "q": f'"{company}" AND (funding OR "hiring" OR "leadership" OR "growth")',
                "api_key": SERPAPI_KEY,
                "num": 5
            })
            results = search.get_dict().get("organic_results", [])
            for r in results:
                snippet = r.get("snippet", "").lower()
                title = r.get("title", "").lower()
                text = f"{title} {snippet}"
                
                if "funding" in text or "raised" in text or "series" in text:
                    signals["funding"] = "Found funding mentions in search: " + r.get("title", "not found")
                    signals["growth_signals"].append(r.get("title", ""))
                if "hiring" in text or "careers" in text or "jobs" in text:
                    signals["hiring_trend"] = "Found hiring mentions in search: " + r.get("title", "not found")
                    signals["growth_signals"].append(r.get("title", ""))
                if "ceo" in text or "leadership" in text or "executive" in text:
                    signals["leadership_changes"] = "Found leadership mentions in search: " + r.get("title", "not found")

            tech_search = GoogleSearch({
                "q": f'"{company}" tech stack OR stackshare',
                "api_key": SERPAPI_KEY,
                "num": 3
            })
            tech_results = tech_search.get_dict().get("organic_results", [])
            signals["tech_stack"] = [r.get("title", "") for r in tech_results]

        except Exception:
            pass

    return signals
