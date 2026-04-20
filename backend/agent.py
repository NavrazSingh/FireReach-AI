from backend.tools.signal_harvester import tool_signal_harvester
from backend.tools.research_analyst import tool_research_analyst
from backend.tools.outreach_sender import tool_outreach_automated_sender

def run_autonomous_outreach(icp: str, company: str, target_email: str) -> dict:
    """
    Executes the strict 4-step sequence.
    Step 1. Call tool_signal_harvester
    Step 2. Pass signals to tool_research_analyst
    Step 3. Pass research to tool_outreach_automated_sender
    Step 4. Return results
    """
    # Step 1
    signals = tool_signal_harvester(company)
    
    # Step 2
    research_result = tool_research_analyst(icp, signals)
    account_brief = research_result.get("account_brief", "")
    
    # Step 3
    outreach_result = tool_outreach_automated_sender(account_brief, signals, target_email)
    
    # Step 4
    return {
        "signals": signals,
        "account_brief": account_brief,
        "email_subject": outreach_result.get("email_subject", ""),
        "email_body": outreach_result.get("email_body", ""),
        "delivery_status": outreach_result.get("delivery_status", "")
    }
