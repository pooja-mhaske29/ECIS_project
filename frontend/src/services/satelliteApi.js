import { api } from './api';

// Satellite-specific API endpoints
export const satelliteService = {
  // Upload and analyze satellite image
  analyzeImage: (formData) =>
    api.post('/satellite/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Fetch satellite image by coordinates
  getImage: (latitude, longitude, date) =>
    api.get('/satellite/image', {
      params: { latitude, longitude, date },
    }),

  // Compare two dates for change detection
  compareImages: (latitude, longitude, startDate, endDate) =>
    api.post('/satellite/compare', {
      latitude,
      longitude,
      start_date: startDate,
      end_date: endDate,
    }),

  // Get historical analysis data
  getHistory: (latitude, longitude, days = 30) =>
    api.get('/satellite/history', {
      params: { latitude, longitude, days },
    }),

  // Get spectral indices for image
  getSpectralIndices: (imageId) =>
    api.get(`/satellite/${imageId}/indices`),

  // Calculate NDVI for image
  calculateNDVI: (imageId) =>
    api.post(`/satellite/${imageId}/ndvi`),

  // Calculate NDWI for image
  calculateNDWI: (imageId) =>
    api.post(`/satellite/${imageId}/ndwi`),

  // Calculate NDBI for image
  calculateNDBI: (imageId) =>
    api.post(`/satellite/${imageId}/ndbi`),

  // Export detection results
  exportResults: (detectionId, format = 'pdf') =>
    api.get(`/satellite/export/${detectionId}`, {
      params: { format },
      responseType: 'blob',
    }),
};

export default satelliteService;
