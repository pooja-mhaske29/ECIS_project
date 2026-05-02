import React from 'react';

const CRIME_TYPES = {
  mining: { label: 'Illegal Mining', color: 'bg-red-500', icon: '⛏️' },
  logging: { label: 'Illegal Logging', color: 'bg-yellow-500', icon: '🌳' },
  pollution: { label: 'Water Pollution', color: 'bg-blue-500', icon: '💧' },
  degradation: { label: 'Land Degradation', color: 'bg-orange-500', icon: '🏜️' },
};

export default function ResultsPanel({ detections = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-emerald-500/20 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-8 h-8 animate-spin border-4 border-emerald-500/20 border-t-emerald-400 rounded-full"></div>
        </div>
        <p className="text-gray-300">Analyzing satellite imagery...</p>
      </div>
    );
  }

  if (detections.length === 0) {
    return (
      <div className="bg-gray-800 border border-emerald-500/20 rounded-lg p-6 text-center">
        <span className="text-4xl mx-auto mb-2 block">✅</span>
        <p className="text-gray-300 text-sm">
          No environmental crimes detected in this image
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Detection Results ({detections.length})
      </h3>

      <div className="space-y-3">
        {detections.map((detection, idx) => {
          const crimeInfo = CRIME_TYPES[detection.type];
          if (!crimeInfo) return null;

          return (
            <div
              key={idx}
              className="bg-gray-800 border border-emerald-500/20 rounded-lg p-4 hover:border-emerald-500/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{crimeInfo.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${crimeInfo.color}`}>
                      {crimeInfo.label}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${detection.confidence > 90 ? 'bg-emerald-500/30 text-emerald-400' :
                        detection.confidence > 75 ? 'bg-yellow-500/30 text-yellow-400' :
                        'bg-red-500/30 text-red-400'}
                    `}>
                      {detection.confidence}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-400">Area Affected</p>
                      <p className="text-white font-semibold">{detection.area_hectares || 'N/A'} ha</p>
                    </div>
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-400">Severity</p>
                      <p className="text-white font-semibold capitalize">{detection.severity || 'Unknown'}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-400">Coordinates</p>
                      <p className="text-white font-semibold text-xs">
                        {detection.lat?.toFixed(3)}, {detection.lon?.toFixed(3)}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 rounded p-2">
                      <p className="text-gray-400">Date</p>
                      <p className="text-white font-semibold">
                        {detection.timestamp ? new Date(detection.timestamp).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>

                  {detection.recommendation && (
                    <div className="mt-3 bg-cyan-500/10 border border-cyan-500/30 rounded p-2">
                      <p className="text-xs text-cyan-400">
                        <strong>Action Required:</strong> {detection.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
        <p className="text-sm text-emerald-400">
          <strong>{detections.length}</strong> environmental crime{detections.length !== 1 ? 's' : ''} detected
          {detections.length > 0 && (
            <> with an average confidence of <strong>
              {Math.round(detections.reduce((a, b) => a + b.confidence, 0) / detections.length)}%
            </strong></>
          )}
        </p>
      </div>
    </div>
  );
}
