import React from 'react';
import LoadingSpinner from '@components/Common/LoadingSpinner';

export default function AnalysisControls({
  onRunDetection,
  onExport,
  isAnalyzing = false,
  hasImage = false,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Analysis Controls</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={onRunDetection}
          disabled={!hasImage || isAnalyzing}
          className="
            flex items-center justify-center gap-2 px-6 py-3
            bg-emerald-500/20 border border-emerald-500/50 text-emerald-300
            hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed
            rounded-lg transition-all duration-300
            font-medium text-sm
          "
        >
          {isAnalyzing ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>🤖</span>
              <span>Run AI Detection</span>
            </>
          )}
        </button>

        <button
          onClick={onExport}
          disabled={!hasImage}
          className="
            flex items-center justify-center gap-2 px-6 py-3
            bg-cyan-500/20 border border-cyan-500/50 text-cyan-300
            hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed
            rounded-lg transition-all duration-300
            font-medium text-sm
          "
        >
          <span>📥</span>
          <span>Export Report</span>
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-emerald-400">Processing</p>
          <p className="text-xs text-emerald-300/70 mt-1">
            AI analyzes spectral data and change detection
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-cyan-400">Accuracy</p>
          <p className="text-xs text-cyan-300/70 mt-1">
            High-confidence detection (85-99%)
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <p className="text-xs font-semibold text-purple-400">Export</p>
          <p className="text-xs text-purple-300/70 mt-1">
            PDF, GeoJSON, or Shapefile format
          </p>
        </div>
      </div>
    </div>
  );
}
