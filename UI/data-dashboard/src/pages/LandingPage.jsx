import React from 'react';
import Navbar from '../Components/Navbar';
import Cube from '../Components/Cube'; // Cube component ka path apne hisaab se adjust kar lena
import Footer from '../Components/Footer';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col border-[12px] border-gray-100 select-none">
      <Navbar onNavigate={onNavigate} />

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 relative">
        {/* Left Side: Text Content */}
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
          
          <div className="flex items-center gap-6 mb-16 flex-wrap">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-black text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-gray-800 transition tracking-wide cursor-pointer shadow-md"
            >
              GO TO DASHBOARD
            </button>
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> LangGraph Multi-Agent Active
            </span>
          </div>

          <div className="mt-auto pt-4 text-xs lg:text-sm text-gray-500">
            <span className="text-red-500 font-bold text-base">*</span> Safe execution with automated SQL safety validation
          </div>
        </div>

        {/* Right Side: 3D Cube */}
        <div className="flex justify-center items-center relative bg-[#071924] md:rounded-l-3xl overflow-hidden shadow-inner">
          <Cube />
        </div>
      </main>

      <Footer />
    </div>
  );
}