import { useState, useCallback } from 'react';
import { satelliteService } from '@services/satelliteApi';

export const useCrimeDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState(null);

  const analyzeImage = useCallback(async (imageFile) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await satelliteService.analyzeImage(formData);
      
      // Handle response data
      const detectionResults = response.data?.detections || [];
      setDetections(detectionResults);
      
      return detectionResults;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to analyze image';
      setError(errorMsg);
      console.error('Analysis error:', err);
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDetections([]);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    isAnalyzing,
    detections,
    error,
    analyzeImage,
    reset,
  };
};

export default useCrimeDetection;
