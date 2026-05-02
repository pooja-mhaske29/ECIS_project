import React from 'react';
import { motion } from 'framer-motion';

export default function Statistics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-4xl font-bold text-white">Statistics</h1>
        <p className="text-gray-400">Detailed analytics and crime statistics</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { emoji: '📊', label: 'Total Crimes', value: 1243, color: 'emerald' },
          { emoji: '✅', label: 'Resolved', value: 856, color: 'cyan' },
          { emoji: '📈', label: 'Trend (30d)', value: '+12%', color: 'yellow' },
          { emoji: '📅', label: 'This Month', value: 342, color: 'purple' },
        ].map((stat, idx) => {
          const colorMap = {
            emerald: 'from-emerald-500 to-emerald-600',
            cyan: 'from-cyan-500 to-cyan-600',
            yellow: 'from-yellow-500 to-yellow-600',
            purple: 'from-purple-500 to-purple-600',
          };
          return (
            <div
              key={idx}
              className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center text-xl`}
                >
                  {stat.emoji}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Detailed Statistics Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* By Crime Type */}
        <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Crimes by Type</h3>
          <div className="space-y-3">
            {[
              { name: 'Illegal Mining', count: 345, pct: 28 },
              { name: 'Illegal Logging', count: 289, pct: 23 },
              { name: 'Water Pollution', count: 421, pct: 34 },
              { name: 'Land Degradation', count: 188, pct: 15 },
            ].map((crime, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{crime.name}</span>
                  <span className="text-emerald-400 font-semibold">{crime.count}</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                    style={{ width: `${crime.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Region */}
        <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Regions</h3>
          <div className="space-y-3">
            {[
              { name: 'Amazon Basin', count: 234, severity: 'critical' },
              { name: 'Congo Rainforest', count: 189, severity: 'high' },
              { name: 'Southeast Asia', count: 156, severity: 'high' },
              { name: 'Madagascar', count: 98, severity: 'medium' },
            ].map((region, idx) => {
              const severityColors = {
                critical: 'bg-red-500/20 border-red-500/50 text-red-400',
                high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
                medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
                low: 'bg-green-500/20 border-green-500/50 text-green-400',
              };
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-semibold">{region.name}</p>
                    <p className="text-xs text-gray-400">{region.count} incidents</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      severityColors[region.severity]
                    }`}
                  >
                    {region.severity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Temporal Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Detection Timeline</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-400">
            📈 Detection rate has increased by <span className="text-emerald-400 font-semibold">23%</span> over the last 30 days
          </p>
          <p className="text-gray-400">
            🔍 Average confidence score: <span className="text-emerald-400 font-semibold">87.5%</span>
          </p>
          <p className="text-gray-400">
            ⏱️ Average response time: <span className="text-emerald-400 font-semibold">2.3 hours</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
