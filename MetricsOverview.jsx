import React from 'react';
import { Zap, RefreshCw, AlertTriangle, Cpu } from 'lucide-react';

export default function MetricsOverview({ metrics }) {
  const cards = [
    { title: 'Total Events', value: metrics.totalEvents || 0, icon: Cpu, color: 'text-blue-400' },
    { title: 'Duplicate Hits Cached', value: metrics.duplicateHits || 0, icon: RefreshCw, color: 'text-emerald-400' },
    { title: 'Fresh Executions', value: metrics.freshExecutions || 0, icon: Zap, color: 'text-purple-400' },
    { title: 'Payload Mismatches', value: metrics.payloadMismatches || 0, icon: AlertTriangle, color: 'text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-slate-900/50 ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
