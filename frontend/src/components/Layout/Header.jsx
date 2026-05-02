import React, { useEffect, useState } from 'react';
import { api } from '@services/api';

export default function Header() {
  const [time, setTime] = useState(new Date());
  const [apiStatus, setApiStatus] = useState('connected');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health');
        setApiStatus(response.ok ? 'connected' : 'error');
      } catch {
        setApiStatus('error');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-gray-900/80 backdrop-blur-lg border-b border-emerald-500/20 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-bold text-white">Environmental Crime Intelligence</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Time Display */}
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-lg">🕐</span>
          <span className="text-sm font-mono">
            {time.toLocaleTimeString()}
          </span>
        </div>

        {/* API Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              apiStatus === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-red-400'
            }`}
          ></div>
          <span className="text-xs text-gray-400">
            {apiStatus === 'connected' ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
}
