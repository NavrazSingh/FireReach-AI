import json
from serpapi import GoogleSearch
from backend.llm import generate_completion
from backend.config import SERPAPI_KEY

def tool_find_contacts(icp: str, company: str) -> list:
    """
    Discovers target contacts based on the ICP and Company using web search and LLM extraction.
    """
    if not SERPAPI_KEY:
        # Fallback if no SerpAPI key is provided
        return mock_contacts(company)
        
    try:
        # Step 1: Get tight persona keywords from ICP
        sys_kw = "Extract 1 or 2 core job-title related keywords from the ICP to search for targets on LinkedIn (e.g. 'security', 'cto', 'engineering'). Output ONLY space-separated keywords without quotes."
        keywords = generate_completion([
            {"role": "system", "content": sys_kw},
            {"role": "user", "content": f"ICP: {icp}"}
        ], max_tokens=20).strip()

        # Step 2: Query LinkedIn profiles
        search = GoogleSearch({
            "q": f'site:linkedin.com/in "{company}" {keywords}',
            "api_key": SERPAPI_KEY,
            "num": 5
        })
        results = search.get_dict().get("organic_results", [])
        
        if not results:
            return mock_contacts(company)
            
        snippets = [f"{r.get('title', '')} - {r.get('snippet', '')}" for r in results]
        
        # Step 3: Extract and generate guessed emails
        sys_extract = """You are a lead generation expert. Extract a list of people from the search snippets who work at the target company. 
For each person, guess their likely business email based on standard corporate name formats (e.g., firstname.lastname@company.com, f.lastname@company.com). 
Return strictly a valid JSON array of objects. Each object must have keys: "name", "role", "email". Do not wrap the JSON in Markdown ticks."""

        prompt = f"Target Company: {company}\nSnippets:\n" + "\n".join(snippets)
        
        raw_json = generate_completion([
            {"role": "system", "content": sys_extract},
            {"role": "user", "content": prompt}
        ], max_tokens=600)
        
        start_idx = raw_json.find("[")
        end_idx = raw_json.rfind("]") + 1
        contacts = json.loads(raw_json[start_idx:end_idx])
        
        if not contacts:
            return mock_contacts(company)
            
        return contacts
    except Exception as e:
        print(f"Error finding contacts: {e}")
        return mock_contacts(company)

def mock_contacts(company: str) -> list:
    company_domain = company.lower().replace(" ", "") + ".com"
    return [
        {"name": "Jane Doe", "role": "VP of Security", "email": f"jane.doe@{company_domain}"},
        {"name": "John Smith", "role": "Director of Engineering", "email": f"john.smith@{company_domain}"}
    ]
