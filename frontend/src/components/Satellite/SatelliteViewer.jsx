import React, { useRef, useEffect, useState } from 'react';

export default function SatelliteViewer({ imageSrc, title = 'Satellite Image' }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      setImageData(img);
      drawImage(img, zoom, panX, panY);
    };
    img.src = imageSrc;
  }, [imageSrc, zoom, panX, panY]);

  const drawImage = (img, currentZoom, currentPanX, currentPanY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = canvas.width / 2 - (img.width / 2) * currentZoom + currentPanX;
    const y = canvas.height / 2 - (img.height / 2) * currentZoom + currentPanY;

    ctx.drawImage(img, x, y, img.width * currentZoom, img.height * currentZoom);

    // Draw grid overlay for reference
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  };

  const handleZoom = (factor) => {
    const newZoom = Math.max(0.5, Math.min(5, zoom * factor));
    setZoom(newZoom);
  };

  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!imageSrc) {
    return (
      <div className="w-full h-96 bg-gray-800 border border-emerald-500/20 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Upload an image to view</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleZoom(1.2)}
            className="p-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors text-lg"
            title="Zoom in"
          >
            🔍+
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="p-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors text-lg"
            title="Zoom out"
          >
            🔍-
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors text-lg"
            title="Reset view"
          >
            ↺
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-96 bg-gray-800 border border-emerald-500/20 rounded-lg cursor-move"
      />

      <div className="flex gap-4 text-xs text-gray-400">
        <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
        <span>Drag to pan | Scroll to zoom</span>
      </div>
    </div>
  );
}
