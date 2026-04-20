import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [targetEmail, setTargetEmail] = useState('');

  const handleRunOutreach = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setTargetEmail(formData.email);

    try {
      const response = await fetch('http://localhost:8000/run-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('An error occurred while running outreach. Please see console for details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (subject, body) => {
    try {
      const response = await fetch('http://localhost:8000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: targetEmail,
          subject,
          body,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok while sending email');
      }

      const data = await response.json();
      setResults(prev => ({
        ...prev,
        email_subject: subject,
        email_body: body,
        delivery_status: data.delivery_status
      }));
      return data.delivery_status;
    } catch (err) {
      setError('An error occurred while sending the email. Please see console for details.');
      console.error(err);
      return `Failed: ${err.message}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex flex-col items-center text-center space-y-4 pb-4">
          <div className="bg-sky-400 p-3 rounded-2xl shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-sky-300 to-indigo-400 bg-clip-text text-transparent">FireReach Autonomous Outreach</h1>
          <p className="text-slate-400 max-w-xl">Enter your target criteria below, and the automated GTM agent will harvest live signals and generate tailored outreach.</p>
        </header>

        <div className="flex flex-col space-y-12">
          <div>
            <InputForm onSubmit={handleRunOutreach} loading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200 text-sm flex items-center shadow-lg">
                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}
          </div>
          
          <div className="pb-10">
            <ResultsPanel results={results} loading={loading} onSendEmail={handleSendEmail} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
