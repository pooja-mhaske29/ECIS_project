import React, { useRef, useState } from 'react';

export default function ComparisonSlider({ beforeImage, afterImage, beforeLabel = 'Before', afterLabel = 'After' }) {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPos = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, newPos)));
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  if (!beforeImage || !afterImage) {
    return (
      <div className="w-full h-96 bg-gray-800 border border-emerald-500/20 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-4xl">🖼️</span>
          <p>Upload two images to compare</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Before/After Comparison</h3>

      <div
        ref={containerRef}
        className="relative w-full h-96 bg-gray-800 border border-emerald-500/20 rounded-lg overflow-hidden cursor-col-resize"
        onMouseDown={handleMouseDown}
      >
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-full object-cover"
            style={{ width: `${(100 / sliderPos) * 100}%` }}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-emerald-400 shadow-lg"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-emerald-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xs">
              ⟨⟩
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
          <p className="text-white text-sm font-semibold">{beforeLabel}</p>
        </div>
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
          <p className="text-white text-sm font-semibold">{afterLabel}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400">Drag the slider to compare images</p>
    </div>
  );
}
