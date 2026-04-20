from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.agent import run_autonomous_outreach

app = FastAPI(title="FireReach Autonomous Outreach Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OutreachRequest(BaseModel):
    icp: str
    company: str
    email: str

class OutreachResponse(BaseModel):
    signals: dict
    account_brief: str
    email_subject: str
    email_body: str
    delivery_status: str

@app.post("/run-outreach", response_model=OutreachResponse)
def run_outreach(req: OutreachRequest):
    result = run_autonomous_outreach(
        icp=req.icp,
        company=req.company,
        target_email=req.email
    )
    return result

class SendEmailRequest(BaseModel):
    email: str
    subject: str
    body: str

@app.post("/send-email")
def send_email(req: SendEmailRequest):
    from backend.tools.outreach_sender import send_outreach_email
    status = send_outreach_email(
        target_email=req.email,
        subject=req.subject,
        body=req.body
    )
    return {"delivery_status": status}

class FindContactsRequest(BaseModel):
    icp: str
    company: str

@app.post("/find-contacts")
def find_contacts(req: FindContactsRequest):
    from backend.tools.contact_finder import tool_find_contacts
    contacts = tool_find_contacts(icp=req.icp, company=req.company)
    return {"contacts": contacts}
