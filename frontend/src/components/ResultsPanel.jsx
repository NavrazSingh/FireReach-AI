import React, { useState, useEffect } from 'react';

const ResultsPanel = ({ results, loading, onSendEmail }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (results) {
      setSubject(results.email_subject || '');
      setBody(results.email_body || '');
    }
  }, [results]);

  if (loading) {
    return (
      <div className="h-[500px] flex flex-col justify-center items-center space-y-6 border border-slate-700 rounded-2xl bg-slate-800/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent"></div>
        <div className="w-16 h-16 border-4 border-slate-700 border-t-sky-400 rounded-full animate-spin z-10"></div>
        <div className="text-center z-10">
          <p className="text-lg font-medium text-slate-200 animate-pulse">Agent Sequence Initialized</p>
          <p className="text-sm text-slate-500 mt-2">Harvesting signals & drafting outreach...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null; // Don't show anything below if not loading and no results.
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center space-x-4">
        <div className="h-[1px] flex-1 bg-slate-800"></div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Execution Results</h2>
        <div className="h-[1px] flex-1 bg-slate-800"></div>
      </div>

      <div className="flex flex-col space-y-8">
        
        {/* Card 1: Captured Signals */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/80 transition-all hover:border-slate-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400">
              <span className="font-bold text-sm">1</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-50 tracking-tight">Captured Signals</h3>
          </div>
          <div className="bg-[#0b1120] rounded-xl p-5 overflow-x-auto border border-slate-800 shadow-inner">
            <pre className="text-sm text-emerald-400/90 font-mono leading-relaxed">
              {JSON.stringify(results.signals, null, 2)}
            </pre>
          </div>
        </div>

        {/* Card 2: Account Research */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/80 transition-all hover:border-slate-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
          </div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400">
              <span className="font-bold text-sm">2</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-50 tracking-tight">Account Research</h3>
          </div>
          <div className="text-base text-slate-300 leading-loose whitespace-pre-wrap">
            {results.account_brief}
          </div>
        </div>

        {/* Card 3: Generated Email */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/80 transition-all hover:border-slate-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <div className="flex items-center space-x-3 mb-6">
             <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400">
              <span className="font-bold text-sm">3</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-50 tracking-tight">Generated Email</h3>
          </div>
          
          <div className="bg-[#0b1120] rounded-xl p-6 md:p-8 border border-slate-800 shadow-inner">
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-4 border-b border-slate-800 pb-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-lg font-medium text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows="8"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-base text-slate-300 leading-relaxed focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Delivery Status */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-500/20 transition-all relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-6 md:mb-0 w-full md:w-auto z-10">
             <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400">
              <span className="font-bold text-sm">4</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-50 tracking-tight">Delivery Status</h3>
          </div>
          
          <div className={`flex flex-col items-center w-full md:w-auto mt-4 md:mt-0 z-10 ${results.delivery_status === 'Pending User Approval' ? '' : 'bg-emerald-500/10 border border-emerald-500/30 px-6 py-4 rounded-xl'}`}>
            {results.delivery_status === 'Pending User Approval' ? (
              <button
                onClick={async () => {
                  setIsSending(true);
                  await onSendEmail(subject, body);
                  setIsSending(false);
                }}
                disabled={isSending}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center space-x-2"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Review & Send Email</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-500/20 p-2 rounded-full shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-emerald-100">Status</span>
                  <span className="text-sm text-emerald-300/80">{results.delivery_status}</span>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsPanel;
