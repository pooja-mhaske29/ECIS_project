import React from 'react';

export default function ToastNotification({ message, type = 'info', onClose }) {
  const typeClasses = {
    success: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
    error: 'bg-red-500/20 border-red-500/50 text-red-300',
    info: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border backdrop-blur-lg
        ${typeClasses[type]}
        animate-in fade-in slide-in-from-top-2
      `}
    >
      <div className="flex-shrink-0 text-lg">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-md transition-colors text-lg"
      >
        ✕
      </button>
    </div>
  );
}
