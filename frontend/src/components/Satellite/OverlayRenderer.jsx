import React, { useRef, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';

const CRIME_COLORS = {
  mining: { color: '#ef4444', label: 'Illegal Mining' },
  logging: { color: '#eab308', label: 'Illegal Logging' },
  pollution: { color: '#3b82f6', label: 'Water Pollution' },
  degradation: { color: '#f97316', label: 'Land Degradation' },
};

export default function OverlayRenderer({ imageSrc, detections = [], onPolygonClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');

      // Draw image
      const x = (canvas.width - img.width) / 2;
      const y = (canvas.height - img.height) / 2;
      ctx.drawImage(img, x, y);

      // Draw detection overlays
      detections.forEach((detection) => {
        const crimeColor = CRIME_COLORS[detection.type];
        if (!crimeColor) return;

        // Scale polygon coordinates to canvas
        const scaledPoints = detection.coordinates.map((point) => [
          x + point[0] * (img.width / 100),
          y + point[1] * (img.height / 100),
        ]);

        // Draw filled polygon
        ctx.fillStyle = crimeColor.color + '40';
        ctx.beginPath();
        ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
        scaledPoints.forEach((point) => ctx.lineTo(point[0], point[1]));
        ctx.closePath();
        ctx.fill();

        // Draw border
        ctx.strokeStyle = crimeColor.color;
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    };
    img.src = imageSrc;
  }, [imageSrc, detections]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Crime Detection Overlay</h3>
        <div className="text-xs text-gray-400">
          {detections.length} detection{detections.length !== 1 ? 's' : ''}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-96 bg-gray-800 border border-emerald-500/20 rounded-lg"
      />

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(CRIME_COLORS).map(([key, { color, label }]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border-2"
              style={{ borderColor: color, backgroundColor: color + '40' }}
            ></div>
            <span className="text-xs text-gray-300">{label}</span>
          </div>
        ))}
      </div>

      {detections.length > 0 && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex gap-2 items-start">
            <span className="text-lg flex-shrink-0">ℹ️</span>
            <p className="text-xs text-cyan-400">
              {detections.length} crime area{detections.length !== 1 ? 's' : ''} detected. Click on any polygon for details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
