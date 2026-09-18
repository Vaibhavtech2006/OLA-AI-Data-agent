import React, { useState } from 'react';

export default function DashboardPage({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  
  // Dynamic States for API Data
  const [agentRoute, setAgentRoute] = useState('Idle');
  const [traceSteps, setTraceSteps] = useState([]);
  const [finalResult, setFinalResult] = useState('');
  const [error, setError] = useState(null);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError(null);
    setTraceSteps([{ step: 'Router Node', detail: 'Analyzing intent...', status: 'loading' }]);
    setFinalResult('');
    setAgentRoute('Processing...');

    try {
      const res = await fetch('http://localhost:8000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        setAgentRoute(data.route);
        setTraceSteps(data.trace);
        setFinalResult(data.result);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      setTraceSteps([{ step: 'Error', detail: 'Failed to connect to agent', status: 'error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200 font-sans flex flex-col select-none">
      
      {/* TOP NAVBAR */}
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#161922]">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-tight text-white flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500 animate-pulse'}`}></span>
            Data Agent Pro
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">v0.1.0</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('landing')} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md transition cursor-pointer">
            ← Back to Home
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
            VK
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r border-gray-800 bg-[#12141c] p-4 flex flex-col gap-6 overflow-y-auto">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Source Manager</div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-800/50 border border-gray-700/50">
                <span className="flex items-center gap-2 text-emerald-400">🗄️ PostgreSQL</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Agents</div>
            <div className="space-y-2 text-sm text-gray-300">
              <div className={`p-2 rounded-md border flex items-center justify-between ${agentRoute === 'SQL' ? 'bg-indigo-900/30 border-indigo-500' : 'bg-gray-900 border-gray-800'}`}>
                <span>SQL Analyst</span>
                <span className={`text-xs ${agentRoute === 'SQL' ? 'text-indigo-400 font-bold' : 'text-gray-500'}`}>
                  {agentRoute === 'SQL' ? 'Active' : 'Idle'}
                </span>
              </div>
              <div className={`p-2 rounded-md border flex items-center justify-between ${agentRoute === 'ETL' ? 'bg-indigo-900/30 border-indigo-500' : 'bg-gray-900 border-gray-800'}`}>
                <span>ETL Analyst</span>
                <span className={`text-xs ${agentRoute === 'ETL' ? 'text-indigo-400 font-bold' : 'text-gray-500'}`}>
                  {agentRoute === 'ETL' ? 'Active' : 'Idle'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER WORKSPACE */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto gap-6 bg-[#0f1117]">
          
          {/* COMMAND CENTER INPUT */}
          <div className="bg-[#161922] border border-gray-800 rounded-xl p-4 shadow-lg">
            <div className="text-xs font-medium text-gray-400 mb-2">COMMAND CENTER — ASK YOUR DATA</div>
            <form onSubmit={handleQuerySubmit} className="flex gap-3">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                placeholder="e.g., Extract API data or Write a SQL query..."
                className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2"
              >
                {loading ? 'Processing...' : 'Run Agent '}
              </button>
            </form>
          </div>

          {/* TWO COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
            
            {/* LIVE AGENT TRACE */}
            <div className="bg-[#161922] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-sm font-semibold text-gray-300">Active Multi-Agent Trace</span>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">LangGraph</span>
              </div>

              <div className="space-y-3 text-sm overflow-y-auto">
                {traceSteps.length === 0 && <p className="text-gray-500 text-xs italic">Waiting for command...</p>}
                
                {traceSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-900 border border-gray-800 animate-fadeIn">
                    <span className={step.status === 'success' ? "text-emerald-400" : step.status === 'error' ? "text-red-400" : "text-amber-400 animate-spin"}>
                      {step.status === 'success' ? '✓' : step.status === 'error' ? '✖' : '↻'}
                    </span>
                    <div>
                      <div className="text-xs text-gray-400">{step.step}</div>
                      <div className="font-medium text-white">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DYNAMIC RESULTS PANE */}
            <div className="bg-[#161922] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-sm font-semibold text-gray-300">Agent Output</span>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('output')} className={`text-xs px-2.5 py-1 rounded cursor-pointer ${activeTab === 'output' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    Text / JSON
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-[#0f1117] rounded-lg border border-gray-800 p-4 overflow-y-auto whitespace-pre-wrap text-sm text-gray-300 font-mono">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-gray-500 animate-pulse">
                    Agent is formulating response...
                  </div>
                ) : error ? (
                  <span className="text-red-400">{error}</span>
                ) : finalResult ? (
                  finalResult
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600 text-xs italic">
                    Output will appear here
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}