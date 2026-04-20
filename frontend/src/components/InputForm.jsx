import React, { useState } from 'react';

const examples = [
  {
    icp: 'We sell high-end cybersecurity training to Series B startups.',
    company: 'Ramp',
    email: 'security@ramp.com'
  },
  {
    icp: 'We offer B2B cloud infrastructure cost optimization software to rapidly expanding SaaS companies.',
    company: 'Vercel',
    email: 'engineering@vercel.com'
  },
  {
    icp: 'We provide AI compliance and legal automation tools to innovative fintech firms.',
    company: 'Stripe',
    email: 'legal@stripe.com'
  }
];

const InputForm = ({ onSubmit, loading }) => {
  const [icp, setIcp] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [isFindingContacts, setIsFindingContacts] = useState(false);

  const handleFindContacts = async () => {
    if (!icp || !company) return;
    setIsFindingContacts(true);
    try {
      const response = await fetch('http://localhost:8000/find-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ icp, company }),
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
        if (data.contacts && data.contacts.length > 0) {
          // pre-select the first contact
          setEmail(data.contacts[0].email);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFindingContacts(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!icp || !company || !email) return;
    onSubmit({ icp, company, email });
  };

  const handleUseExample = () => {
    // Pick a random example
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setIcp(randomExample.icp);
    setCompany(randomExample.company);
    setEmail(randomExample.email);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-slate-700 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-sky-400 to-indigo-500 h-full opacity-70"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-50 tracking-tight">Target Definition</h2>
        <button 
          onClick={handleUseExample}
          type="button"
          disabled={loading}
          className="text-xs font-medium px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-full text-slate-200 transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          <span>Use Example</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">ICP (Ideal Customer Profile)</label>
          <textarea 
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:bg-slate-900 transition-all shadow-inner placeholder-slate-600"
            rows="3"
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            placeholder="e.g. We sell high-end cybersecurity training to Series B startups..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Target Company</label>
            <input 
              type="text" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:bg-slate-900 transition-all shadow-inner placeholder-slate-600"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Ramp"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-400">Target Email</label>
              <button 
                type="button" 
                onClick={handleFindContacts}
                disabled={!icp || !company || isFindingContacts}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors flex items-center space-x-1 ${(!icp || !company || isFindingContacts) ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 border border-indigo-500/30'}`}
              >
                {isFindingContacts ? (
                  <>
                    <div className="w-3 h-3 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span>Find Contacts</span>
                  </>
                )}
              </button>
            </div>
            
            {contacts.length > 0 && (
              <div className="mb-4 space-y-2 max-h-48 overflow-y-auto pr-1 select-none">
                {contacts.map((c, i) => (
                  <div 
                    key={i} 
                    onClick={() => setEmail(c.email)} 
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0 ${email === c.email ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'}`}
                  >
                     <div className="flex flex-col">
                       <span className={`text-sm font-bold ${email === c.email ? 'text-indigo-200' : 'text-slate-200'}`}>{c.name}</span>
                       <span className="text-xs text-slate-400 truncate">{c.role}</span>
                     </div>
                     <span className={`text-xs font-mono ml-0 sm:ml-2 sm:text-right ${email === c.email ? 'text-indigo-300' : 'text-slate-400'}`}>{c.email}</span>
                  </div>
                ))}
              </div>
            )}
            
            <input 
              type="email" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:bg-slate-900 transition-all shadow-inner placeholder-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={contacts.length > 0 ? "Or enter custom email..." : "e.g. security@ramp.com"}
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading || !icp || !company || !email}
            className={`w-full py-4 px-6 rounded-xl font-bold text-slate-900 flex justify-center items-center space-x-3 transition-all duration-300 ${
              loading || !icp || !company || !email 
              ? 'bg-slate-600 cursor-not-allowed opacity-50' 
              : 'bg-sky-400 hover:bg-sky-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-5px_rgba(56,189,248,0.4)]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing Target...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                <span>Run Autonomous Outreach</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
