import React from 'react';

export default function Navbar({ onNavigate }) {
  return (
    <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-200">
      <div className="text-xl font-bold tracking-tight">
        // Data Agent
      </div>
      
      <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wide">
        <span className="hover:text-gray-500 cursor-pointer transition">ARCHITECTURE</span>
        <span className="hover:text-gray-500 cursor-pointer transition">FEATURES</span>
        <span className="hover:text-gray-500 cursor-pointer transition">DOCS</span>
      </div>
      
      <button 
        onClick={() => onNavigate('dashboard')}
        className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition flex items-center gap-2 cursor-pointer shadow-sm"
      >
        DASHBOARD <span className="text-lg leading-none">↗</span>
      </button>
    </nav>
  );
}