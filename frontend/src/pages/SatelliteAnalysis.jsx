import React, { useState } from 'react';
import ImageUploader from '@components/Satellite/ImageUploader';
import SatelliteViewer from '@components/Satellite/SatelliteViewer';
import BandSelector from '@components/Satellite/BandSelector';
import ComparisonSlider from '@components/Satellite/ComparisonSlider';
import OverlayRenderer from '@components/Satellite/OverlayRenderer';
import AnalysisControls from '@components/Satellite/AnalysisControls';
import ResultsPanel from '@components/Satellite/ResultsPanel';
import useCrimeDetection from '@hooks/useCrimeDetection';
import { motion } from 'framer-motion';

export default function SatelliteAnalysis() {
  const [currentImage, setCurrentImage] = useState(null);
  const [compareImage, setCompareImage] = useState(null);
  const [selectedBand, setSelectedBand] = useState('true-color');
  const [showComparison, setShowComparison] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const { isAnalyzing, detections, error, analyzeImage } = useCrimeDetection();

  const handleImageSelect = (imageData) => {
    setCurrentImage(imageData);
    setShowOverlay(false);
  };

  const handleCompareImageSelect = (imageData) => {
    setCompareImage(imageData);
  };

  const handleRunDetection = async () => {
    if (!currentImage?.file) return;
    await analyzeImage(currentImage.file);
    setShowOverlay(true);
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log('Export report');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-4xl font-bold text-white">Satellite Analysis</h1>
        <p className="text-gray-400">
          Upload satellite imagery to detect environmental crimes using AI-powered analysis
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Image Upload */}
          <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Upload Image</h2>
            <ImageUploader
              onImageSelect={handleImageSelect}
              isLoading={isAnalyzing}
            />
          </div>

          {/* Band Selector */}
          {currentImage && (
            <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
              <BandSelector
                selectedBand={selectedBand}
                onBandSelect={setSelectedBand}
              />
            </div>
          )}

          {/* Analysis Controls */}
          <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
            <AnalysisControls
              onRunDetection={handleRunDetection}
              onExport={handleExport}
              isAnalyzing={isAnalyzing}
              hasImage={!!currentImage}
            />
          </div>

          {/* Comparison Toggle */}
          {currentImage && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 font-semibold
                ${
                  showComparison
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                    : 'border-cyan-500/30 bg-gray-800/50 text-gray-300 hover:border-cyan-500/50'
                }
              `}
            >
              {showComparison ? 'Hide Comparison' : 'Show Comparison'}
            </button>
          )}
        </motion.div>

        {/* Right Panel - Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Image Viewer */}
          {currentImage && (
            <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
              <SatelliteViewer
                imageSrc={currentImage.preview}
                title={`${currentImage.name} (${selectedBand})`}
              />
            </div>
          )}

          {/* Comparison Slider */}
          {showComparison && (
            <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Compare with Previous Image</h3>
                <ImageUploader
                  onImageSelect={handleCompareImageSelect}
                  isLoading={false}
                />
              </div>

              {currentImage && compareImage && (
                <ComparisonSlider
                  beforeImage={compareImage.preview}
                  afterImage={currentImage.preview}
                  beforeLabel="Previous"
                  afterLabel="Current"
                />
              )}
            </div>
          )}

          {/* Crime Detection Overlay */}
          {showOverlay && currentImage && (
            <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
              <OverlayRenderer
                imageSrc={currentImage.preview}
                detections={detections}
              />
            </div>
          )}

          {/* Detection Results */}
          {(detections.length > 0 || isAnalyzing) && (
            <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
              <ResultsPanel
                detections={detections}
                isLoading={isAnalyzing}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Information Cards */}
      {!currentImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <p className="font-semibold text-emerald-400 mb-2">🛰️ Satellite Data</p>
            <p className="text-sm text-emerald-300/70">
              Upload Sentinel-2 or Landsat-8 satellite images for analysis
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="font-semibold text-cyan-400 mb-2">🤖 AI Detection</p>
            <p className="text-sm text-cyan-300/70">
              Advanced algorithms detect illegal mining, logging, and pollution
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="font-semibold text-purple-400 mb-2">📊 Analysis</p>
            <p className="text-sm text-purple-300/70">
              Get detailed reports with confidence scores and affected areas
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
