import React, { useState } from 'react';
import axios from 'axios';
import { Play, Copy, RefreshCw, AlertOctagon } from 'lucide-react';

export default function EventSimulator({ token, onEventProcessed }) {
  const [idempotencyKey, setIdempotencyKey] = useState(`key-${Date.now()}`);
  const [amount, setAmount] = useState('250.00');
  const [accountFrom, setAccountFrom] = useState('ACC-8821');
  const [accountTo, setAccountTo] = useState('ACC-4491');
  const [lastResponse, setLastResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateNewKey = () => {
    setIdempotencyKey(`key-${Date.now()}`);
  };

  const executeRequest = async (overrideKey = idempotencyKey, overrideAmount = amount) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/events/process-payment',
        { accountFrom, accountTo, amount: parseFloat(overrideAmount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Idempotency-Key': overrideKey
          }
        }
      );
      setLastResponse({ status: res.status, data: res.data, isError: false });
    } catch (err) {
      setLastResponse({
        status: err.response?.status || 500,
        data: err.response?.data || { message: err.message },
        isError: true
      });
    } finally {
      setLoading(false);
      onEventProcessed();
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 mb-6">
      <h2 className="text-md font-bold text-white flex items-center mb-4">
        <Play className="w-4 h-4 text-indigo-400 mr-2" /> Event Payload Simulator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">X-Idempotency-Key Header</label>
          <div className="flex">
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-l px-3 py-2 w-full font-mono"
            />
            <button
              onClick={generateNewKey}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 rounded-r text-xs flex items-center"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-3 py-2 w-full font-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => executeRequest()}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded font-medium flex items-center"
        >
          Send Fresh Request
        </button>

        <button
          onClick={() => executeRequest(idempotencyKey)}
          disabled={loading}
          className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded font-medium flex items-center"
        >
          <Copy className="w-3 h-3 mr-1" /> Retry Duplicate Request
        </button>

        <button
          onClick={() => executeRequest(idempotencyKey, String(parseFloat(amount) + 50))}
          disabled={loading}
          className="bg-amber-700 hover:bg-amber-600 text-white text-xs px-4 py-2 rounded font-medium flex items-center"
        >
          <AlertOctagon className="w-3 h-3 mr-1" /> Test Payload Mismatch
        </button>
      </div>

      {lastResponse && (
        <div className="mt-4 p-3 rounded bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-400">HTTP Response Status:</span>
            <span className={`font-mono font-bold ${lastResponse.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
              {lastResponse.status}
            </span>
          </div>
          <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded">
            {JSON.stringify(lastResponse.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
