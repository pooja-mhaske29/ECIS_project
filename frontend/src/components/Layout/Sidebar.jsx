import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { emoji: '🌐', label: 'Location Analysis', path: '/analyze' },
  { emoji: '📊', label: 'Dashboard', path: '/dashboard' },
  { emoji: '🔍', label: 'Crime Detection', path: '/detection' },
  { emoji: '📋', label: 'Reports', path: '/reports' },
  { emoji: '🌍', label: 'Hotspots', path: '/hotspots' },
  { emoji: '📈', label: 'Statistics', path: '/statistics' },
  { emoji: '⚙️', label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-gray-900 via-emerald-900 to-gray-900 border-r border-emerald-500/20 backdrop-blur-lg z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-lg">
            🛰️
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">ECIS</h1>
            <p className="text-xs text-emerald-400">Environmental Crime</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                ${(
                  isActive
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-300'
                )}
              `}
            >
              <span className="text-xl flex-shrink-0">{item.emoji}</span>
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-500/20">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
          <p className="text-xs text-emerald-400 text-center">
            Environmental Crime Intelligence System
          </p>
        </div>
      </div>
    </div>
  );
}
