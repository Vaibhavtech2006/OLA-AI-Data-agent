import React, { useState } from 'react';

export default function DashboardPage({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('table');

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200 font-sans flex flex-col select-none">
      
      {/* TOP NAVBAR */}
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#161922]">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Data Agent Pro
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">v0.1.0</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('landing')}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md transition cursor-pointer"
          >
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
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/30 text-gray-400 transition">
                <span>⚡ API Connectors</span>
                <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">2</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Agents</div>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="p-2 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-between">
                <span>SQL Analyst Agent</span>
                <span className="text-xs text-emerald-400">Idle</span>
              </div>
              <div className="p-2 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-between">
                <span>ETL Analyst Agent</span>
                <span className="text-xs text-emerald-400">Idle</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-800 text-xs text-gray-500">
            <div>Database: localhost:5432</div>
            <div>Latency: 24ms</div>
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
                placeholder="e.g., Show me top 5 users with highest ratings or extract API data..."
                className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-2"
              >
                {loading ? 'Processing...' : 'Run Agent 🚀'}
              </button>
            </form>
          </div>

          {/* TWO COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LIVE AGENT TRACE */}
            <div className="bg-[#161922] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-sm font-semibold text-gray-300">Active Multi-Agent Trace</span>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">LangGraph</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                  <span className="text-emerald-400">✓</span>
                  <div>
                    <div className="text-xs text-gray-400">Router Node</div>
                    <div className="font-medium text-white">Classified as SQL Query</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                  <span className="text-emerald-400">✓</span>
                  <div>
                    <div className="text-xs text-gray-400">Schema Context</div>
                    <div className="font-medium text-white">Fetched rides & users schema</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                  <span className="text-emerald-400">✓</span>
                  <div>
                    <div className="text-xs text-gray-400">Safety Validation</div>
                    <div className="font-medium text-emerald-400">Passed (No destructive operations)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC RESULTS PANE */}
            <div className="bg-[#161922] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-sm font-semibold text-gray-300">Results & Output</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('table')}
                    className={`text-xs px-2.5 py-1 rounded cursor-pointer ${activeTab === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    Table
                  </button>
                  <button 
                    onClick={() => setActiveTab('chart')}
                    className={`text-xs px-2.5 py-1 rounded cursor-pointer ${activeTab === 'chart' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    Chart View
                  </button>
                </div>
              </div>

              {activeTab === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-gray-900 text-gray-400 border-b border-gray-800">
                      <tr>
                        <th className="p-2">Vehicle Type</th>
                        <th className="p-2">Avg Rating</th>
                        <th className="p-2">Total Rides</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      <tr>
                        <td className="p-2 font-medium text-white">Sedan</td>
                        <td className="p-2 text-emerald-400">4.8</td>
                        <td className="p-2">1,240</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium text-white">SUV</td>
                        <td className="p-2 text-emerald-400">4.6</td>
                        <td className="p-2">850</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium text-white">Hatchback</td>
                        <td className="p-2 text-emerald-400">4.4</td>
                        <td className="p-2">2,100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-40 flex items-end justify-around gap-4 pt-4 px-2 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="w-12 bg-indigo-500 rounded-t h-[80%] flex items-center justify-center text-[10px] text-white">4.8</div>
                  <div className="w-12 bg-indigo-500 rounded-t h-[65%] flex items-center justify-center text-[10px] text-white">4.6</div>
                  <div className="w-12 bg-indigo-500 rounded-t h-[55%] flex items-center justify-center text-[10px] text-white">4.4</div>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}