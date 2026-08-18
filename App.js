import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import MetricsOverview from './components/MetricsOverview';
import EventSimulator from './components/EventSimulator';
import EventLogTable from './components/EventLogTable';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('developer@system.com');
  const [password, setPassword] = useState('password123');
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Login failed. Ensure seed user registered or backend is running.');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Dev Engine User',
        email,
        password,
        role: 'Admin'
      });
      alert('User registered! Click Login now.');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const fetchSystemData = useCallback(async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [logsRes, metricsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events/logs', { headers }),
        axios.get('http://localhost:5000/api/events/metrics', { headers })
      ]);
      setLogs(logsRes.data.logs);
      setMetrics(metricsRes.data.metrics);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchSystemData();
  }, [fetchSystemData]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar token={token} onLogout={handleLogout} />

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        {!token ? (
          <div className="max-w-md mx-auto bg-slate-800/80 border border-slate-700 p-6 rounded-xl shadow-xl mt-12">
            <h2 className="text-xl font-bold text-white mb-2">Engine Login</h2>
            <p className="text-xs text-slate-400 mb-6">Authenticate to run simulation tests and view event caches.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded font-medium">
                  Login
                </button>
                <button type="button" onClick={handleRegister} className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 rounded font-medium">
                  Register Seed User
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <MetricsOverview metrics={metrics} />
            <EventSimulator token={token} onEventProcessed={fetchSystemData} />
            <EventLogTable logs={logs} />
          </>
        )}
      </main>
    </div>
  );
}
