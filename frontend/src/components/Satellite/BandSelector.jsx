import React from 'react';

const BANDS = [
  { id: 'true-color', name: 'True Color', description: 'Natural RGB composite' },
  { id: 'false-color', name: 'False Color', description: 'NIR composite for vegetation' },
  { id: 'ndvi', name: 'NDVI', description: 'Vegetation index (green scale)' },
  { id: 'ndwi', name: 'NDWI', description: 'Water index (blue scale)' },
  { id: 'ndbi', name: 'NDBI', description: 'Built-up index (red scale)' },
  { id: 'ndmi', name: 'NDMI', description: 'Moisture index' },
];

export default function BandSelector({ selectedBand = 'true-color', onBandSelect }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎨</span>
        <h3 className="text-lg font-semibold text-white">Spectral Indices</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {BANDS.map((band) => (
          <button
            key={band.id}
            onClick={() => onBandSelect(band.id)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-300 text-left
              ${
                selectedBand === band.id
                  ? 'border-emerald-400 bg-emerald-500/20'
                  : 'border-emerald-500/30 bg-gray-800/50 hover:border-emerald-500/50'
              }
            `}
          >
            <p className="font-semibold text-white text-sm">{band.name}</p>
            <p className="text-xs text-gray-400 mt-1">{band.description}</p>
          </button>
        ))}
      </div>

      {/* Index Explanation */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
        <p className="text-xs text-cyan-400">
          <strong>Note:</strong> Spectral indices are mathematical calculations from satellite band data.
          NDVI identifies vegetation, NDWI detects water bodies, and NDBI highlights built-up areas.
        </p>
      </div>
    </div>
  );
}
