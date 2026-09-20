import React, { useState } from 'react';

// Clean SVG Icons for Agents
const Icons = {
  database: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  pipeline: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  search: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  chart: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  cpu: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  trending: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
};

const AGENTS = [
  { id: 'sql', name: 'SQL Analyst', icon: Icons.database },
  { id: 'etl', name: 'ETL Pipeline', icon: Icons.pipeline },
  { id: 'eda', name: 'Data Profiler', icon: Icons.search },
  { id: 'visualization', name: 'Viz Engine', icon: Icons.chart },
  { id: 'ml', name: 'ML Scientist', icon: Icons.cpu },
  { id: 'forecasting', name: 'Time-Series', icon: Icons.trending }
];

export default function DashboardPage({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');

  const [plan, setPlan] = useState([]);
  const [traceSteps, setTraceSteps] = useState([]);
  const [finalResult, setFinalResult] = useState('');
  const [chartBase64, setChartBase64] = useState('');
  const [datasetPath, setDatasetPath] = useState('');
  const [error, setError] = useState(null);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);
    setTraceSteps([{ step: 'Planner Node', detail: 'Synthesizing execution graph...', status: 'loading' }]);
    setFinalResult('');
    setChartBase64('');
    setPlan([]);
    setActiveTab('insights');

    try {
      const res = await fetch('http://localhost:8000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (data.status === 'success') {
        setPlan(data.plan_executed || []);
        setTraceSteps(data.trace || []);
        setFinalResult(data.result);
        setChartBase64(data.chart_base64 || '');
        setDatasetPath(data.dataset_path || '');
        if (data.chart_base64) setActiveTab('visuals');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      setTraceSteps(prev => [...prev, { step: 'System Error', detail: err.message, status: 'error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* HEADER */}
      <header className="h-14 border-b border-neutral-800/60 flex items-center justify-between px-6 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
          <span className="font-semibold text-white tracking-wide text-sm">Data Agent Studio</span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium tracking-wide">ENTERPRISE</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('landing')} className="text-xs text-neutral-400 hover:text-white transition-colors duration-200">
            Back to Workspace
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-semibold text-white text-xs shadow-lg shadow-indigo-500/20">
            VK
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-72 border-r border-neutral-800/60 bg-neutral-950 flex flex-col z-10">
          <div className="p-5 border-b border-neutral-800/60">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-4">Active Cluster</div>
            <div className="space-y-1.5">
              {AGENTS.map((agent) => {
                const isActive = plan.includes(agent.id);
                return (
                  <div key={agent.id} className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all duration-300 ${isActive ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-500 hover:bg-neutral-900/50 border border-transparent'}`}>
                    <span className={isActive ? 'text-indigo-400' : 'text-neutral-600'}>{agent.icon}</span>
                    <span className={isActive ? 'font-medium' : ''}>{agent.name}</span>
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)] animate-pulse" />}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* TERMINAL TRACE */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-4">System Trace</div>
            <div className="space-y-4 font-mono text-[11px]">
              {traceSteps.length === 0 && <div className="text-neutral-600">Awaiting user input...</div>}
              {traceSteps.map((step, idx) => (
                <div key={idx} className="relative pl-4 border-l border-neutral-800">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-neutral-950 border border-neutral-700"></div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`font-bold ${step.status === 'success' ? 'text-emerald-500' : step.status === 'error' ? 'text-red-500' : 'text-amber-500'}`}>
                      {step.status === 'success' ? '[OK]' : step.status === 'error' ? '[ERR]' : '[RUN]'}
                    </span>
                    <span className="text-neutral-300 font-semibold tracking-wide">{step.step}</span>
                  </div>
                  <div className="text-neutral-500 leading-relaxed truncate">{step.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col bg-[#050505] relative">
          
          {/* COMMAND BAR */}
          <div className="p-6 border-b border-neutral-800/60 bg-neutral-950/50">
            <form onSubmit={handleQuerySubmit} className="relative max-w-4xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                placeholder="Ask the cluster to extract, analyze, or forecast..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-5 pr-32 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !query}
                className="absolute right-2 top-2 bottom-2 bg-white text-black px-5 rounded-lg text-xs font-bold hover:bg-neutral-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Processing' : 'Execute'}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </form>
          </div>

          {/* RESULTS WORKSPACE */}
          <div className="flex-1 flex flex-col p-8 overflow-hidden max-w-7xl w-full mx-auto">
            
            {/* PILL TABS */}
            <div className="flex gap-2 mb-6 p-1 bg-neutral-900/50 border border-neutral-800/50 rounded-lg w-fit">
              {['insights', 'visuals', 'dataset'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-200 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-5">
                  <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <div className="text-xs font-medium tracking-widest uppercase animate-pulse">Running Analytical Pipeline...</div>
                </div>
              ) : error ? (
                <div className="p-5 rounded-lg border border-red-900/50 bg-red-950/20 text-red-400 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <div className="font-semibold mb-1">Execution Failed</div>
                    {error}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
                  {activeTab === 'insights' && (
                    <div className="h-full text-neutral-300">
                      {finalResult ? (
                        <div className="whitespace-pre-wrap bg-neutral-900/40 p-6 rounded-xl border border-neutral-800/60 leading-relaxed text-sm">
                          {finalResult}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-neutral-600 text-sm">
                          Output will render here after execution.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'visuals' && (
                    <div className="h-full flex items-start justify-center">
                      {chartBase64 ? (
                        <img src={`data:image/png;base64,${chartBase64}`} alt="Generated Analysis" className="max-w-full rounded-xl border border-neutral-800/60 shadow-2xl" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-neutral-600 text-sm">
                          No visualization artifacts generated in this run.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'dataset' && (
                    <div className="h-full">
                      {datasetPath ? (
                        <div className="bg-neutral-900/40 rounded-xl border border-neutral-800/60 p-6 font-mono text-xs text-neutral-400">
                          <div className="flex items-center gap-2 text-emerald-400 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span className="font-semibold">Target dataset secured in volume</span>
                          </div>
                          <div className="p-3 bg-black/30 rounded border border-neutral-800 text-neutral-300">
                            {datasetPath}
                          </div>
                          <p className="mt-5 text-neutral-600">/* Note: Table preview requires a dataframe rendering library like ag-Grid. */</p>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-neutral-600 text-sm">
                          No working dataset currently mounted.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}