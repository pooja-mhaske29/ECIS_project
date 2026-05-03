import React from 'react';
import StatsCards from '@components/Dashboard/StatsCards';
import CrimeTypeChart from '@components/Dashboard/CrimeTypeChart';
import RiskLevelChart from '@components/Dashboard/RiskLevelChart';
import TrendsChart from '@components/Dashboard/TrendsChart';
import RecentAlerts from '@components/Dashboard/RecentAlerts';
import HotspotMap from '@components/Dashboard/HotspotMap';
import { motion } from 'framer-motion';


export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          Real-time environmental crime intelligence and geospatial risk metrics
        </p>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StatsCards />
      </motion.div>

      {/* Charts Grid - First Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <CrimeTypeChart />
        <RiskLevelChart />
      </motion.div>

      {/* Trends Chart - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TrendsChart />
      </motion.div>

      {/* Map and Alerts - Second Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <HotspotMap />
        </div>
        <RecentAlerts />
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-sm text-emerald-400"
      >
        <p>
          <strong>Last Updated:</strong> {new Date().toLocaleTimeString()} | Data refreshes every 10 seconds
        </p>
      </motion.div>
    </div>
  );
}
