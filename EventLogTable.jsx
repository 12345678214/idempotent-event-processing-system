import React from 'react';
import { CheckCircle2, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

export default function EventLogTable({ logs }) {
  const getBadge = (status) => {
    switch (status) {
      case 'EXECUTED_FRESH':
        return <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] px-2 py-0.5 rounded flex items-center w-max"><CheckCircle2 className="w-3 h-3 mr-1" /> Executed Fresh</span>;
      case 'CACHE_REPLAY':
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded flex items-center w-max"><RefreshCw className="w-3 h-3 mr-1" /> Cache Replay</span>;
      case 'PAYLOAD_MISMATCH':
        return <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] px-2 py-0.5 rounded flex items-center w-max"><AlertTriangle className="w-3 h-3 mr-1" /> Payload Mismatch</span>;
      default:
        return <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] px-2 py-0.5 rounded flex items-center w-max"><Clock className="w-3 h-3 mr-1" /> {status}</span>;
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
      <h2 className="text-md font-bold text-white mb-4">Live Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-700">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Idempotency Key</th>
              <th className="p-3">Status / Outcome</th>
              <th className="p-3">Duplicate Hit</th>
              <th className="p-3 text-right">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-500">No events recorded yet. Send a request above!</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                  <td className="p-3 font-mono text-indigo-300">{log.idempotencyKey}</td>
                  <td className="p-3">{getBadge(log.status)}</td>
                  <td className="p-3">{log.isDuplicateHit ? 'Yes (Cached)' : 'No'}</td>
                  <td className="p-3 text-right font-mono text-slate-400">{log.executionTimeMs} ms</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
