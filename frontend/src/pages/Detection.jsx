import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { crimeService } from '../services/api';
import { crimeTypeColors, severityColors, formatCoordinates } from '../utils/constants';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useApi, useForm } from '@/hooks';

export default function Detection() {
  const [result, setResult] = useState(null);

  const { values: formData, handleChange } = useForm(
    {
      latitude: '',
      longitude: '',
      locationName: '',
      address: '',
    },
    async (values) => {
      const lat = parseFloat(values.latitude);
      const lng = parseFloat(values.longitude);

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        toast.error('Invalid coordinates');
        throw new Error('Invalid coordinates');
      }

      const response = await crimeService.analyzeLocation(lat, lng);
      setResult(response.data);
    }
  );

  // useApi hook for detection
  const { loading, execute } = useApi(
    async () => {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Invalid coordinates');
      }

      const response = await crimeService.analyzeLocation(lat, lng);
      setResult(response.data);
      toast.success('Crime detection analysis complete');
      return response.data;
    },
    { showError: true }
  );

  const handleDetect = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await execute();
    } catch (error) {
      // Error handling is done by useApi hook
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleChange({
            target: {
              name: 'latitude',
              value: position.coords.latitude.toString(),
            },
          });
          handleChange({
            target: {
              name: 'longitude',
              value: position.coords.longitude.toString(),
            },
          });
          toast.success('Location retrieved');
        },
        () => {
          toast.error('Unable to retrieve location');
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-neon-green mb-2">Crime Detection</h1>
        <p className="text-gray-400">Analyze coordinates for environmental crimes</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <motion.div
          whileHover={{ borderColor: 'rgba(0, 255, 255, 0.3)' }}
          className="lg:col-span-1 card"
        >
          <h3 className="text-lg font-semibold text-neon-green mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location Input</span>
          </h3>

          <form onSubmit={handleDetect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location Name
              </label>
              <input
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Amazon Rainforest"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="-15.5"
                  min="-90"
                  max="90"
                  step="0.0001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="-56.5"
                  min="-180"
                  max="180"
                  step="0.0001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Amazon Basin, Brazil"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full btn-secondary mb-2"
            >
              📍 Use Current Location
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Location'}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Main Result Card */}
            <motion.div
              whileHover={{ borderColor: 'rgba(0, 255, 255, 0.3)' }}
              className={`card border-2 ${crimeTypeColors[result.crime_type_prediction]?.border}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-2xl font-bold capitalize ${crimeTypeColors[result.crime_type_prediction]?.text}`}>
                    {result.crime_display_name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{result.region_name}</p>
                </div>
                <span className={`badge ${severityColors[result.severity]?.badge}`}>
                  {result.risk_level}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-dark-700/30 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Confidence Score</p>
                  <p className="text-neon-green text-xl font-bold">{result.recommendations.priority}</p>
                </div>
                <div className="p-3 bg-dark-700/30 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Risk Score</p>
                  <p className="text-neon-cyan text-xl font-bold">{result.risk_score}/100</p>
                </div>
                <div className="p-3 bg-dark-700/30 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Land Use</p>
                  <p className="text-neon-green text-lg font-bold capitalize">{result.land_use_type?.replace(/_/g, ' ')}</p>
                </div>
                <div className="p-3 bg-dark-700/30 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Location</p>
                  <p className="text-neon-cyan text-sm font-bold">{formatCoordinates(result.coordinates.lat, result.coordinates.lon)}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-neon-green mb-2">Environmental News</h4>
                <p className="text-gray-300 text-sm">{result.environmental_news}</p>
              </div>

              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm font-semibold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{result.recommendations.immediate_action}</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* No Results State */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 text-center py-12 text-gray-400"
        >
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Enter coordinates and click "Analyze Location" to begin detection</p>
        </motion.div>
      )}
    </div>
  );
}
