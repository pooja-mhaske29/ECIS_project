import React from 'react';

const getRiskTone = (score) => {
  if (score >= 70) {
    return {
      label: 'High',
      bar: 'bg-red-500',
      text: 'text-red-300',
      ring: 'border-red-500/50',
      bg: 'bg-red-500/10',
    };
  }

  if (score >= 40) {
    return {
      label: 'Medium',
      bar: 'bg-amber-400',
      text: 'text-amber-300',
      ring: 'border-amber-500/50',
      bg: 'bg-amber-500/10',
    };
  }

  return {
    label: 'Low',
    bar: 'bg-emerald-400',
    text: 'text-emerald-300',
    ring: 'border-emerald-500/50',
    bg: 'bg-emerald-500/10',
  };
};

export default function RiskMeter({ score = 0, label = 'Environmental Risk Score' }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const tone = getRiskTone(normalizedScore);

  return (
    <div className={`rounded-lg border ${tone.ring} ${tone.bg} p-5`}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{normalizedScore.toFixed(1)}</span>
            <span className="text-lg text-gray-400">/ 100</span>
          </div>
        </div>
        <div className={`text-sm font-semibold uppercase tracking-wide ${tone.text}`}>
          {tone.label}
        </div>
      </div>

      <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-gray-900/70">
        <div
          className={`h-full rounded-full ${tone.bar} transition-all duration-500`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
}
