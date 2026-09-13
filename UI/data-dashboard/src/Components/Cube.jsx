import React, { useState, useEffect } from 'react';
import './Cube.css';

// Typing effect helper component for the popup cards
function TypewriterText({ text, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
}

export default function Cube() {
  return (
    <div className="scene text-slate-800">
      <div className="cube-core">
        
        {/* FACE 1: FRONT (Core Architecture & Intent Routing) */}
        <div className="cube-face front">
          <div className="glass-panel flex flex-col justify-center p-5">
            <div className="text-center mb-3">
              <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2.5 py-1 rounded-full uppercase">Core Architecture</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 text-center mb-1">Agentic AI Data Agent</h2>
            <p className="text-[10px] text-slate-600 text-center leading-relaxed">
              Intelligent system processing natural language queries and routing them to specialized execution units.
            </p>
          </div>
          
          {/* STABLE TYPING POP-UPS */}
          <div className="outer-popup popup-left fade-sync-front">
            <div className="popup-card">
              🤖 <TypewriterText text="Main Router: Delegates tasks based on user intent analysis." />
            </div>
            <div className="popup-card mt-3">
              ⚡ <TypewriterText text="Dynamic LLM selection based on active task complexity." />
            </div>
          </div>
          <div className="outer-popup popup-right fade-sync-front">
            <div className="popup-card">
              ✨ <TypewriterText text="LangGraph orchestration for seamless multi-agent workflows." />
            </div>
          </div>
        </div>

        {/* FACE 2: RIGHT (SQL Analyst & Safety) */}
        <div className="cube-face right">
          <div className="glass-panel p-4 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Execution Unit</h3>
            <div className="bg-white/60 border border-slate-200 p-3 rounded-xl mb-2 shadow-sm">
              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">SQL Analyst Agent</span>
              <p className="text-[11px] font-semibold mt-1 text-slate-800">Optimized database querying & schema lookups.</p>
            </div>
            <div className="bg-white/60 border border-slate-200 p-3 rounded-xl shadow-sm">
              <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">Safety Validation</span>
              <p className="text-[11px] font-semibold mt-1 text-slate-800">Pre-execution checks for secure query formatting.</p>
            </div>
          </div>

          {/* STABLE TYPING POP-UPS */}
          <div className="outer-popup popup-left fade-sync-right">
            <div className="popup-card">
              🔒 <TypewriterText text="Safety validation layer filters malicious or malformed SQL queries." />
            </div>
            <div className="popup-card mt-3">
              📊 <TypewriterText text="Tool-based modular agent architecture design." />
            </div>
          </div>
        </div>

        {/* FACE 3: BACK (ETL Pipeline & Modern Engineering) */}
        <div className="cube-face back">
          <div className="glass-panel p-5 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Data Operations</h3>
            <div className="bg-white/60 border border-slate-200 p-3 rounded-xl shadow-sm">
              <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">ETL Analyst Agent</span>
              <p className="text-[11px] font-semibold mt-1 text-slate-800">Handles complex data extraction & transformation.</p>
            </div>
          </div>

          {/* STABLE TYPING POP-UPS */}
          <div className="outer-popup popup-right fade-sync-back">
            <div className="popup-card">
              🔄 <TypewriterText text="Automated ETL pipeline generation for real-time analytics." />
            </div>
            <div className="popup-card mt-3">
              🛠️ <TypewriterText text="Built with modern AI engineering & robust state management." />
            </div>
          </div>
        </div>

        {/* Empty faces */}
        <div className="cube-face left"><div className="glass-panel"></div></div>
        <div className="cube-face top"><div className="glass-panel"></div></div>
        <div className="cube-face bottom"><div className="glass-panel"></div></div>
        
      </div>
    </div>
  );
}