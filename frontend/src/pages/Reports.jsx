import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { violationService } from '../services/api';
import { crimeTypeColors, statusColors, formatDate, getRiskLevelColor, getRiskLevelLabel } from '../utils/constants';
import { Search, Download, Filter, ChevronDown } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFetch } from '@/hooks';

export default function Reports() {
  const [filters, setFilters] = useState({
    crimeType: '',
    status: '',
    minRisk: '',
    maxRisk: '',
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch violations with filters and pagination
  const fetchViolationsData = useCallback(() => {
    return violationService.getViolations({
      ...filters,
      page,
      limit: 10,
    });
  }, [filters, page]);

  const { data: response, loading } = useFetch(fetchViolationsData, [filters, page]);

  const violations = response?.data || [];
  const pagination = {
    total: response?.total || 0,
    page: response?.page || 1,
    pages: response?.pages || 1,
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const handleExport = () => {
    const csv = [
      ['Crime Type', 'Status', 'Risk Score', 'Confidence', 'Location', 'Detected At'],
      ...violations.map((v) => [
        v.crimeType,
        v.status,
        v.riskScore,
        v.confidence,
        `${v.location.address}`,
        formatDate(v.detectedAt),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `violations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Report exported successfully');
  };

  if (loading && violations.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-neon-green mb-2">Crime Reports</h1>
          <p className="text-gray-400">Search and filter detected environmental crimes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          disabled={violations.length === 0}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <motion.div
          whileHover={{ borderColor: 'rgba(0, 255, 255, 0.3)' }}
          className="card flex items-center space-x-3"
        >
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by crime type, location, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-gray-300 placeholder-gray-500"
          />
        </motion.div>

        {/* Filter Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowFilters(!showFilters)}
          className="card flex items-center justify-between w-full"
        >
          <div className="flex items-center space-x-2 text-neon-green">
            <Filter className="w-4 h-4" />
            <span>Advanced Filters</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Filters Expanded */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Crime Type</label>
              <select
                name="crimeType"
                value={filters.crimeType}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="illegal_logging">Illegal Logging</option>
                <option value="illegal_mining">Illegal Mining</option>
                <option value="water_pollution">Water Pollution</option>
                <option value="land_degradation">Land Degradation</option>
                <option value="ecosystem_damage">Ecosystem Damage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="detected">Detected</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false_alarm">False Alarm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Risk Score</label>
              <input
                type="number"
                name="minRisk"
                value={filters.minRisk}
                onChange={handleFilterChange}
                className="input-field"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Risk Score</label>
              <input
                type="number"
                name="maxRisk"
                value={filters.maxRisk}
                onChange={handleFilterChange}
                className="input-field"
                min="0"
                max="100"
                placeholder="100"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-x-auto"
      >
        {violations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No violations found matching your criteria</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-cyan/20">
                  <th className="text-left py-3 px-4 font-semibold text-neon-green">Crime Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-neon-green">Location</th>
                  <th className="text-center py-3 px-4 font-semibold text-neon-green">Risk Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-neon-green">Confidence</th>
                  <th className="text-center py-3 px-4 font-semibold text-neon-green">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-neon-green">Detected At</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((violation, index) => (
                  <motion.tr
                    key={violation._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(0, 255, 136, 0.05)' }}
                    className="border-b border-neon-cyan/10 hover:border-neon-cyan/30 transition-all"
                  >
                    <td className="py-3 px-4">
                      <span className={`badge ${crimeTypeColors[violation.crimeType]?.border}`}>
                        {violation.crimeType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-100">{violation.location.address}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <p className={`font-bold ${getRiskLevelColor(violation.riskScore)}`}>
                        {violation.riskScore}
                      </p>
                      <p className="text-xs text-gray-400">{getRiskLevelLabel(violation.riskScore)}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <p className="text-neon-cyan font-semibold">{violation.confidence.toFixed(1)}%</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${statusColors[violation.status] ? 'bg-dark-700/30 border border-gray-500/30' : 'bg-gray-900/30 border border-gray-500/30'}`}>
                        {violation.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-gray-400">
                      {formatDate(violation.detectedAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-neon-cyan/20">
                <p className="text-sm text-gray-400">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </p>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    ← Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next →
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
