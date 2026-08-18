import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';

export default function Navbar({ token, onLogout }) {
  return (
    <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">Idempotency Core</h1>
          <p className="text-xs text-slate-400">Resilient Distributed Event Processing Engine</p>
        </div>
      </div>
      {token && (
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-xs text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800">
            <Activity className="w-3 h-3 mr-1 animate-pulse" /> Engine Active
          </span>
          <button
            onClick={onLogout}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
