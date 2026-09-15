import React from 'react';

export default function Footer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 border-t border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      <div className="p-8 flex items-center gap-4">
        <div>
          <div className="text-2xl font-medium tracking-tight">10k+</div>
          <div className="text-sm text-gray-500">queries processed</div>
        </div>
      </div>
      <div className="p-8 flex flex-col justify-center">
        <div className="text-2xl font-medium tracking-tight">Multi-Agent</div>
        <div className="text-sm text-gray-500">SQL & ETL support</div>
      </div>
      <div className="p-8 flex flex-col justify-center">
        <div className="text-2xl font-medium tracking-tight">{'< 250ms'}</div>
        <div className="text-sm text-gray-500">routing latency</div>
      </div>
      <div className="p-8 flex items-center justify-around text-lg font-bold text-gray-800 tracking-wider">
        <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">PostgreSQL</span>
        <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">LangGraph</span>
      </div>
    </div>
  );
}
