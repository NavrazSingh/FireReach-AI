import json
import smtplib
from email.message import EmailMessage
from backend.llm import generate_completion
from backend.config import SMTP_EMAIL, SMTP_PASSWORD

def tool_outreach_automated_sender(account_brief: str, signals: dict, target_email: str) -> dict:
    """
    Generates a personalized outreach email without sending it.
    """
    sys_prompt = "You are an expert cybersecurity GTM outbound writer. Output pure JSON format without formatting ticks, containing 'email_subject' and 'email_body'. Keep body under 150 words."
    
    prompt = f"""
    Account Brief: {account_brief}
    Signals: {json.dumps(signals, indent=2)}
    
    Please generate an email for {target_email}.
    - Start the email with a formal greeting like "Dear [Name]", extracting the recipient's name from the email address or signals.
    - Format the email body using proper line breaks (\\n\\n) to create well-spaced paragraphs for readability.
    - Reference the harvested signals explicitly (e.g. "I noticed you're hiring several engineers...").
    - Avoid generic templates.
    - Connect company growth to cybersecurity risk.
    - End the email with a professional sign-off like "Regards,\\n[Your Name or FireReach AI]".
    - Remain under 150 words.
    
    Output strictly valid JSON with keys: "email_subject", "email_body"
    """
    
    messages = [
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": prompt}
    ]
    
    response = generate_completion(messages, max_tokens=1000)
    
    # Parse JSON from response
    try:
        start_idx = response.find("{")
        end_idx = response.rfind("}") + 1
        if start_idx != -1 and end_idx != -1:
            json_str = response[start_idx:end_idx]
            email_data = json.loads(json_str)
        else:
            raise ValueError("JSON not found in response")
    except Exception as e:
        email_data = {
            "email_subject": f"Cybersecurity alignment and recent growth",
            "email_body": response.strip()
        }
    
    subject = email_data.get("email_subject", "Cybersecurity Alignment")
    body = email_data.get("email_body", "")

    return {
        "email_subject": subject,
        "email_body": body,
        "delivery_status": "Pending User Approval"
    }

def send_outreach_email(target_email: str, subject: str, body: str) -> str:
    """
    Sends the outreach email via SMTP.
    """
    delivery_status = "mock_sent (development mode)"
    
    if SMTP_EMAIL and SMTP_PASSWORD:
        try:
            msg = EmailMessage()
            msg.set_content(body)
            msg['Subject'] = subject
            msg['From'] = SMTP_EMAIL
            msg['To'] = target_email
            
            # Using Gmail SMTP as standard
            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            delivery_status = "sent"
        except Exception as e:
            delivery_status = f"failed to send: {str(e)}"
            print(f"SMTP Error: {e}")
            
    return delivery_status
