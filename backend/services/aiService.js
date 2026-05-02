const axios = require('axios');

// AI Service configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
const fs = require('fs');
const path = require('path');
const AI_SERVICE_TIMEOUT = 30000; // 30 seconds

class AIService {
  /**
   * Call AI service for single location crime detection
   * @param {number} latitude - Location latitude
   * @param {number} longitude - Location longitude
   * @param {string} locationName - Optional location name
   * @returns {Promise<Object>} Crime detection result
   */
  static async detectCrime(latitude, longitude, locationName) {
    try {
      console.log(`🔍 Calling AI Service: POST ${AI_SERVICE_URL}/api/v1/detect`);
      
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/v1/detect`,
        {
          latitude,
          longitude,
          location_name: locationName
        },
        {
          timeout: AI_SERVICE_TIMEOUT,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ AI Service response received');
      return response.data;
    } catch (error) {
      console.error('❌ AI Service error:', error.message);
      throw new Error(`AI Service error: ${error.message}`);
    }
  }

  /**
   * Call AI service for batch crime detection
   * @param {Array} locations - Array of {latitude, longitude, location_name}
   * @returns {Promise<Object>} Batch detection results
   */
  static async batchDetectCrimes(locations) {
    try {
      console.log(`🔍 Calling AI Service: POST ${AI_SERVICE_URL}/api/v1/batch-detect`);
      
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/v1/batch-detect`,
        {
          locations
        },
        {
          timeout: AI_SERVICE_TIMEOUT,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ AI Service batch response received');
      return response.data;
    } catch (error) {
      console.error('❌ AI Service batch error:', error.message);
      throw new Error(`AI Service batch error: ${error.message}`);
    }
  }

  /**
   * Get AI service statistics
   * @returns {Promise<Object>} AI service stats
   */
  static async getStats() {
    try {
      console.log(`📊 Calling AI Service: GET ${AI_SERVICE_URL}/api/v1/stats`);
      
      const response = await axios.get(
        `${AI_SERVICE_URL}/api/v1/stats`,
        {
          timeout: AI_SERVICE_TIMEOUT
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ AI Service stats error:', error.message);
      throw new Error(`AI Service stats error: ${error.message}`);
    }
  }

  /**
   * Get crime hotspots from AI service
   * @returns {Promise<Object>} Hotspot data
   */
  static async getHotspots() {
    try {
      console.log(`🔥 Calling AI Service: GET ${AI_SERVICE_URL}/api/v1/hotspots`);
      
      const response = await axios.get(
        `${AI_SERVICE_URL}/api/v1/hotspots`,
        {
          timeout: AI_SERVICE_TIMEOUT
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ AI Service hotspots error:', error.message);
      throw new Error(`AI Service hotspots error: ${error.message}`);
    }
  }

  /**
   * Get AI service reports
   * @returns {Promise<Object>} Report data
   */
  static async getReports() {
    try {
      console.log(`📋 Calling AI Service: GET ${AI_SERVICE_URL}/api/v1/reports`);
      
      const response = await axios.get(
        `${AI_SERVICE_URL}/api/v1/reports`,
        {
          timeout: AI_SERVICE_TIMEOUT
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ AI Service reports error:', error.message);
      throw new Error(`AI Service reports error: ${error.message}`);
    }
  }

  /**
   * Check AI service health
   * @returns {Promise<boolean>} Health status
   */
static async healthCheck() {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/health`,
        {
          timeout: 5000
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('⚠️  AI Service health check failed:', error.message);
      return false;
    }
  }

  /**
   * Analyze satellite image for environmental crimes
   * @param {Buffer} imageBuffer - Image file buffer
   * @param {string} filename - Original filename
   * @param {number} latitude - Image location latitude
   * @param {number} longitude - Image location longitude
   * @param {string} userId - User ID for tracking
   * @returns {Promise<Object>} Analysis result from AI service
   */
  static async analyzeSatelliteImage(imageBuffer, filename, latitude, longitude, userId) {
    try {
      console.log(`🛰️  Calling AI Service satellite analysis for ${filename}`);
      
      const FormData = require('form-data');
      const fs = require('fs');
      
      // Create temp file
      const tempPath = `./temp/${Date.now()}-${filename}`;
      fs.mkdirSync('./temp', { recursive: true });
      fs.writeFileSync(tempPath, imageBuffer);
      
      const form = new FormData();
      form.append('file', fs.createReadStream(tempPath), filename);
      form.append('latitude', latitude.toString());
      form.append('longitude', longitude.toString());
      
      const response = await axios.post(
        `${AI_SERVICE_URL}/api/v1/satellite/analyze`,
        form,
        {
          timeout: 60000, // 60s for image processing
          headers: {
            ...form.getHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Cleanup temp file
      fs.unlinkSync(tempPath);
      
      console.log('✅ Satellite image analysis completed');
      return response.data;
    } catch (error) {
      console.error('❌ Satellite analysis error:', error.message);
      throw new Error(`Satellite analysis failed: ${error.response?.data?.detail || error.message}`);
    }
  }
}

module.exports = AIService;

