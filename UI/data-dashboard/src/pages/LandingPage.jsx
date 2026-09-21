import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Cube from '../Components/Cube'; 
import Footer from '../Components/Footer';

// --- COMPLEX ARCHITECTURE DIAGRAM MODAL (FULL WIDTH FIXED) ---
function ArchitectureModal({ onClose }) {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = {
    webhook5: {
      title: "Webhook 5",
      type: "Trigger",
      desc: "Listens for incoming GET/POST requests from external platforms (like Slack or GitHub) to trigger the AI workflow.",
      tech: "FastAPI / Webhooks"
    },
    agent10: {
      title: "AI Agent 10",
      type: "Tools Agent",
      desc: "The core orchestrator. It receives the payload, consults the LLM, reads memory, and decides which tools to execute.",
      tech: "LangGraph Multi-Agent"
    },
    openai: {
      title: "OpenAI 5",
      type: "Chat Model",
      desc: "The language model that provides reasoning and tool-calling capabilities to the main agent.",
      tech: "Groq / Llama 3 / OpenAI"
    },
    memory: {
      title: "Simple Memory 4",
      type: "State Database",
      desc: "Maintains the conversational context and previous tool outputs across the graph execution.",
      tech: "LangChain Checkpointers"
    },
    notion: {
      title: "Notion Integration",
      type: "External Tool",
      desc: "Executes API calls to automatically create or update Notion documentation pages based on agent logic.",
      tech: "Notion API"
    },
    gitlab: {
      title: "GitLab Integration",
      type: "External Tool",
      desc: "Automatically raises issues or commits code to GitLab repositories when the agent detects a bug or task.",
      tech: "GitLab API"
    },
    if1: {
      title: "If 1 (Router)",
      type: "Conditional Node",
      desc: "Evaluates the agent's output. Routes to True (Webhook 6) if a specific condition is met, otherwise routes to False (Webhook 7).",
      tech: "Conditional Edges"
    },
    webhook6: {
      title: "Respond to Webhook 6",
      type: "Action (True Path)",
      desc: "Fires a success response or triggers a downstream pipeline if the router evaluates to True.",
      tech: "HTTP POST"
    },
    webhook7: {
      title: "Respond to Webhook 7",
      type: "Action (False Path)",
      desc: "Fires an alternative response or error handling pipeline if the router evaluates to False.",
      tech: "HTTP POST"
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8">
      {/* Modal Container: Increased width to max-w-[1400px] and w-[95vw] to prevent cutting */}
      <div className="bg-[#0a0a0a] w-[95vw] max-w-[1400px] rounded-2xl border border-neutral-800 shadow-2xl flex flex-col xl:flex-row overflow-hidden relative min-h-[600px]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white z-20 bg-neutral-900 p-2 rounded-full border border-neutral-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Left Side: The Interactive Complex Diagram (Removed slider/overflow) */}
        <div className="flex-1 p-4 lg:p-8 border-b xl:border-b-0 xl:border-r border-neutral-800 bg-[#050505] relative flex flex-col items-center justify-center w-full">
          
          <div className="flex items-start justify-center gap-2 lg:gap-4 relative z-10 w-full scale-90 lg:scale-100 origin-center mt-8">
            
            {/* 1. Webhook Input */}
            <div className="flex items-center mt-12">
              <div 
                onMouseEnter={() => setActiveNode('webhook5')}
                className="w-24 lg:w-32 py-4 rounded-xl bg-[#1a1a2e] border-2 border-indigo-500/50 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-500/20 transition-all shadow-lg"
              >
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className="text-[10px] lg:text-xs text-indigo-200 font-semibold text-center">Webhook 5</span>
              </div>
              {/* Arrow */}
              <div className="w-6 lg:w-10 border-t-2 border-neutral-600 relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] lg:text-[9px] text-neutral-500 font-mono">1 item</span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-neutral-600 rotate-45"></div>
              </div>
            </div>

            {/* 2. Main Agent & Attached Sub-nodes */}
            <div className="flex flex-col items-center relative">
              {/* Main Agent Box */}
              <div 
                onMouseEnter={() => setActiveNode('agent10')}
                className="w-48 lg:w-64 p-4 lg:p-5 rounded-xl bg-white border-2 border-neutral-300 flex items-center gap-3 lg:gap-4 cursor-pointer hover:border-blue-400 transition-all z-10 shadow-xl"
              >
                <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-black leading-tight">AI Agent 10</div>
                  <div className="text-[10px] lg:text-xs text-neutral-500">Tools Agent</div>
                </div>
              </div>

              {/* Dashed Connection Area for Sub-nodes */}
              <div className="w-full flex justify-between px-2 lg:px-4 mt-8 lg:mt-12 relative">
                {/* Horizontal Dashed Line */}
                <div className="absolute top-[-32px] lg:top-[-48px] left-[10%] right-[10%] border-t-2 border-dashed border-indigo-500/40"></div>
                
                {/* Sub Nodes */}
                {[
                  { id: 'openai', label: 'OpenAI', sub: 'Model', icon: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/> },
                  { id: 'memory', label: 'Memory', sub: 'State', icon: <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4" /> },
                  { id: 'notion', label: 'Notion', sub: 'page', icon: <path d="M4 4h16v16H4zM9 8h6v8H9z"/> },
                  { id: 'gitlab', label: 'GitLab', sub: 'issue', icon: <path d="M12 22l-9-9 4-10 2 6h6l2-6 4 10-9 9z"/> }
                ].map((item, idx) => (
                  <div key={item.id} className="flex flex-col items-center relative mx-1">
                    {/* Vertical Dashed Line */}
                    <div className="absolute -top-8 lg:-top-12 h-8 lg:h-12 border-l-2 border-dashed border-indigo-500/40"></div>
                    <div 
                      onMouseEnter={() => setActiveNode(item.id)}
                      className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:scale-110 transition-all z-10 shadow-lg text-neutral-700"
                    >
                      <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon.props.d} /></svg>
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-[10px] lg:text-xs font-bold text-neutral-300">{item.label}</div>
                      <div className="text-[8px] lg:text-[9px] text-neutral-500">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Router Node */}
            <div className="flex items-center mt-12">
              <div className="w-6 lg:w-10 border-t-2 border-neutral-600 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-neutral-600 rotate-45"></div>
              </div>
              <div 
                onMouseEnter={() => setActiveNode('if1')}
                className="w-16 h-16 lg:w-24 lg:h-24 rounded-2xl bg-white border-2 border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all shadow-xl"
              >
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                <span className="text-[10px] lg:text-xs font-bold text-neutral-800">If 1</span>
              </div>
            </div>

            {/* 4. Output Branches */}
            <div className="flex flex-col justify-center gap-8 lg:gap-12 relative mt-2 lg:mt-4">
              
              {/* Top Branch (True) */}
              <div className="flex items-center">
                <div className="w-8 lg:w-12 border-t-2 border-neutral-600 relative rounded-tl-lg">
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] lg:text-[10px] text-emerald-400 font-bold bg-[#050505] px-1">true</span>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-neutral-600 rotate-45"></div>
                </div>
                <div 
                  onMouseEnter={() => setActiveNode('webhook6')}
                  className="w-24 lg:w-32 py-3 lg:py-4 rounded-xl bg-white border-2 border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-all shadow-lg"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-pink-600 mb-1 lg:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="text-[9px] lg:text-[10px] font-bold text-neutral-800 text-center leading-tight">Respond to<br/>Webhook 6</span>
                </div>
              </div>

              {/* Bottom Branch (False) */}
              <div className="flex items-center">
                <div className="w-8 lg:w-12 border-t-2 border-neutral-600 relative rounded-bl-lg">
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] lg:text-[10px] text-red-400 font-bold bg-[#050505] px-1">false</span>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-neutral-600 rotate-45"></div>
                </div>
                <div 
                  onMouseEnter={() => setActiveNode('webhook7')}
                  className="w-24 lg:w-32 py-3 lg:py-4 rounded-xl bg-white border-2 border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-all shadow-lg"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-pink-600 mb-1 lg:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="text-[9px] lg:text-[10px] font-bold text-neutral-800 text-center leading-tight">Respond to<br/>Webhook 7</span>
                </div>
              </div>

              {/* Angled Connecting lines from router to branches */}
              <div className="absolute -left-6 lg:-left-8 top-[30px] lg:top-[40px] bottom-[40px] lg:bottom-[50px] w-6 lg:w-8 border-t-2 border-b-2 border-r-2 border-neutral-600 rounded-r-xl z-[-1]"></div>

            </div>

          </div>
          
          <div className="absolute bottom-4 lg:bottom-6 text-[9px] lg:text-[10px] text-neutral-500 uppercase tracking-widest font-semibold flex items-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800">
            <svg className="w-3 h-3 lg:w-4 lg:h-4 animate-bounce text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
            Hover over nodes for technical details
          </div>
        </div>

        {/* Right Side: Information Panel */}
        <div className="w-full xl:w-96 p-6 lg:p-8 flex flex-col bg-[#0a0a0a] border-t xl:border-t-0 xl:border-l border-neutral-800">
          {activeNode ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">{nodes[activeNode].type}</div>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-tight">{nodes[activeNode].title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed flex-1">
                {nodes[activeNode].desc}
              </p>
              <div className="mt-6 pt-6 border-t border-neutral-800/60">
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3 font-bold">Core Technology</div>
                <div className="inline-block px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  {nodes[activeNode].tech}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500">
              <svg className="w-12 h-12 lg:w-16 lg:h-16 mb-4 lg:mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              <h4 className="text-white font-semibold mb-2 text-sm lg:text-base">Inspect Architecture</h4>
              <p className="text-xs leading-relaxed">Hover over any node in the graph to inspect its logic, tools, and technical specifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function LandingPage({ onNavigate }) {
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col border-[12px] border-gray-100 select-none relative">
      <Navbar onNavigate={onNavigate} />

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 relative">
        <div className="flex flex-col justify-center px-10 py-16 lg:p-20 relative">
          <div className="text-3xl mb-6 text-black font-bold">✧</div>
          
          <h1 className="text-5xl lg:text-7xl font-normal leading-[1.08] tracking-tight mb-8">
            Intelligent data <br />
            processing <br />
            at scale
          </h1>
          
          <p className="text-gray-600 max-w-md text-base lg:text-lg leading-relaxed mb-10">
            Connect your databases, run natural language SQL/ETL queries, and view multi-agent routing traces instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-black text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-gray-800 transition tracking-wide cursor-pointer shadow-md w-full sm:w-auto"
            >
              GO TO DASHBOARD
            </button>
            
            <button 
              onClick={() => setIsDiagramOpen(true)}
              className="px-8 py-4 rounded-full text-sm font-semibold border-2 border-gray-200 text-black hover:border-black hover:bg-gray-50 transition tracking-wide cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              How it works
            </button>
          </div>

          <div className="flex items-center gap-6 mb-8 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> LangGraph Multi-Agent Active
            </span>
          </div>

          <div className="mt-auto pt-4 text-xs lg:text-sm text-gray-500">
            <span className="text-red-500 font-bold text-base">*</span> Safe execution with automated SQL safety validation
          </div>
        </div>

        <div className="flex justify-center items-center relative bg-white md:rounded-l-3xl overflow-visible hidden md:flex">
          <Cube />
        </div>
      </main>

      <Footer />

      {/* Render the Modal conditionally */}
      {isDiagramOpen && (
        <ArchitectureModal onClose={() => setIsDiagramOpen(false)} />
      )}
    </div>
  );
}