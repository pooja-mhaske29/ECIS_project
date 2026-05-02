const Violation = require('../models/Violation');
const AIService = require('../services/aiService');

/**
 * @desc    Detect crime at a location using AI service
 * @route   POST /api/ai-integration/detect
 * @access  Private
 */
const detectCrime = async (req, res) => {
  try {
    const { latitude, longitude, location_name, address } = req.body;

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    console.log(`🎯 Processing crime detection for location: ${location_name || address}`);

    // Call AI Service
    const aiResult = await AIService.detectCrime(latitude, longitude, location_name);

    // Map environmental crime types to backend enum
    const crimeTypeMap = {
      'illegal_logging': 'illegal_logging',
      'illegal_mining': 'illegal_mining',
      'water_pollution': 'water_pollution',
      'land_degradation': 'land_degradation',
      'ecosystem_damage': 'ecosystem_damage',
      'none': 'none'
    };

    const mappedCrimeType = crimeTypeMap[aiResult.crime_type] || aiResult.crime_type;

    // Create violation record in database
    const violationData = {
      title: `${aiResult.crime_type.replace(/_/g, ' ').toUpperCase()} - ${location_name || address}`,
      description: aiResult.evidence,
      crimeType: mappedCrimeType,
      riskScore: aiResult.risk_score,
      confidence: aiResult.confidence,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
        address: address
      },
      status: aiResult.severity === 'critical' ? 'investigating' : 'detected',
      detectedAt: new Date(aiResult.timestamp),
      detectedBy: req.user ? req.user.id : null,
      source: 'ai_detection',
      spectralIndices: {
        ndvi: aiResult.spectral_indices.ndvi,
        ndwi: aiResult.spectral_indices.ndwi,
        ndbi: aiResult.spectral_indices.ndbi
      },
      affectedAreaHectares: aiResult.affected_area_hectares,
      requiredAction: aiResult.required_action,
      aiReportId: aiResult.report_id
    };

    const violation = await Violation.create(violationData);

    console.log(`✅ Violation record created: ${violation._id}`);

    res.status(201).json({
      success: true,
      data: {
        violationId: violation._id,
        aiResult: aiResult,
        databaseRecord: violation
      }
    });
  } catch (error) {
    console.error('❌ Crime detection error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Batch detect crimes using AI service
 * @route   POST /api/ai-integration/batch-detect
 * @access  Private
 */
const batchDetectCrimes = async (req, res) => {
  try {
    const { locations } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'locations array is required'
      });
    }

    console.log(`🎯 Processing batch crime detection for ${locations.length} locations`);

    // Prepare locations for AI service
    const aiLocations = locations.map(loc => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
      location_name: loc.location_name
    }));

    // Call AI Service
    const aiBatchResult = await AIService.batchDetectCrimes(aiLocations);

    // Create violation records for each detected crime
    const violations = [];
    const createdViolations = [];

    for (let i = 0; i < aiBatchResult.reports.length; i++) {
      const aiReport = aiBatchResult.reports[i];
      const originalLocation = locations[i];

      const crimeTypeMap = {
        'illegal_logging': 'illegal_logging',
        'illegal_mining': 'illegal_mining',
        'water_pollution': 'water_pollution',
        'land_degradation': 'land_degradation',
        'ecosystem_damage': 'ecosystem_damage',
        'none': 'none'
      };

      const mappedCrimeType = crimeTypeMap[aiReport.crime_type] || aiReport.crime_type;

      const violationData = {
        title: `${aiReport.crime_type.replace(/_/g, ' ').toUpperCase()} - ${originalLocation.location_name || 'Unknown Location'}`,
        description: aiReport.evidence,
        crimeType: mappedCrimeType,
        riskScore: aiReport.risk_score,
        confidence: aiReport.confidence,
        location: {
          type: 'Point',
          coordinates: [originalLocation.longitude, originalLocation.latitude],
          address: originalLocation.location_name || `${originalLocation.latitude}, ${originalLocation.longitude}`
        },
        status: aiReport.severity === 'critical' ? 'investigating' : 'detected',
        detectedAt: new Date(aiReport.timestamp),
        detectedBy: req.user ? req.user.id : null,
        source: 'ai_detection',
        spectralIndices: {
          ndvi: aiReport.spectral_indices.ndvi,
          ndwi: aiReport.spectral_indices.ndwi,
          ndbi: aiReport.spectral_indices.ndbi
        },
        affectedAreaHectares: aiReport.affected_area_hectares,
        requiredAction: aiReport.required_action,
        aiReportId: aiReport.report_id
      };

      violations.push(violationData);
    }

    // Insert all violations
    const insertedViolations = await Violation.insertMany(violations);
    createdViolations.push(...insertedViolations);

    console.log(`✅ Created ${createdViolations.length} violation records`);

    res.status(201).json({
      success: true,
      data: {
        batchId: aiBatchResult.batch_id,
        totalLocations: aiBatchResult.total_locations,
        detectedCrimes: aiBatchResult.detected_crimes,
        createdViolations: createdViolations.length,
        processingTimeMs: aiBatchResult.processing_time_ms,
        violationIds: createdViolations.map(v => v._id),
        aiReports: aiBatchResult.reports
      }
    });
  } catch (error) {
    console.error('❌ Batch detection error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get AI service hotspots
 * @route   GET /api/ai-integration/hotspots
 * @access  Private
 */
const getHotspots = async (req, res) => {
  try {
    console.log('🔥 Fetching hotspots from AI service');

    const hotspots = await AIService.getHotspots();

    res.json({
      success: true,
      data: hotspots
    });
  } catch (error) {
    console.error('❌ Hotspots error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get AI service statistics
 * @route   GET /api/ai-integration/stats
 * @access  Private
 */
const getAIStats = async (req, res) => {
  try {
    console.log('📊 Fetching stats from AI service');

    const stats = await AIService.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Stats error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get AI service reports
 * @route   GET /api/ai-integration/reports
 * @access  Private
 */
const getAIReports = async (req, res) => {
  try {
    console.log('📋 Fetching reports from AI service');

    const reports = await AIService.getReports();

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('❌ Reports error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Health check for AI service
 * @route   GET /api/ai-integration/health
 * @access  Public
 */
const checkAIHealth = async (req, res) => {
  try {
    const isHealthy = await AIService.healthCheck();

    res.json({
      success: true,
      aiServiceHealthy: isHealthy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      aiServiceHealthy: false,
      error: error.message
    });
  }
};

/**
 * @desc    Webhook receiver for AI service notifications
 * @route   POST /api/ai-integration/webhook
 * @access  Public
 */
const receiveAIWebhook = async (req, res) => {
  try {
    const { event, data, timestamp } = req.body;

    console.log(`📬 Webhook received: ${event} at ${timestamp}`);

    // Handle different webhook events
    if (event === 'crime_detected') {
      // Create violation from webhook data
      const violationData = {
        title: `${data.crime_type.replace(/_/g, ' ').toUpperCase()} - ${data.location.name || 'Unknown'}`,
        description: data.evidence,
        crimeType: data.crime_type,
        riskScore: data.risk_score,
        confidence: data.confidence,
        location: {
          type: 'Point',
          coordinates: [data.location.longitude, data.location.latitude],
          address: data.location.name || `${data.location.latitude}, ${data.location.longitude}`
        },
        status: data.severity === 'critical' ? 'investigating' : 'detected',
        detectedAt: new Date(data.timestamp),
        source: 'ai_detection',
        spectralIndices: data.spectral_indices,
        affectedAreaHectares: data.affected_area_hectares,
        requiredAction: data.required_action,
        aiReportId: data.report_id
      };

      await Violation.create(violationData);
      console.log('✅ Violation created from webhook');
    }

    res.json({
      success: true,
      message: 'Webhook received and processed',
      event
    });
  } catch (error) {
    console.error('❌ Webhook processing error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Analyze satellite image for environmental crimes
 * @route   POST /api/ai-integration/satellite/analyze
 * @access  Private
 */
const analyzeSatelliteImage = async (req, res) => {
  try {
    // multer handles multipart/form-data automatically when using multer middleware
    const { latitude, longitude, address, location_name } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    console.log(`🛰️ Processing satellite analysis for ${file.originalname} at [${latitude}, ${longitude}]`);

    // Call AI Service
    const aiResult = await AIService.analyzeSatelliteImage(
      file.buffer,
      file.originalname,
      parseFloat(latitude),
      parseFloat(longitude),
      req.user.id
    );

    // Crime type mapping (ai-service returns string)
    const crimeTypeMap = {
      'illegal_logging': 'illegal_logging',
      'illegal_mining': 'illegal_mining',
      'water_pollution': 'water_pollution',
      'land_degradation': 'land_degradation',
      'air_pollution': 'air_pollution',
      'healthy_ecosystem': 'none'
    };

    const mappedCrimeType = crimeTypeMap[aiResult.crime_type] || aiResult.crime_type || 'none';

    // Create violation record
    const violationData = {
      title: `${aiResult.crime_display_name || aiResult.crime_type.toUpperCase()} - Satellite Analysis`,
      description: aiResult.evidence_summary || aiResult.evidence,
      crimeType: mappedCrimeType,
      riskScore: aiResult.risk_score || 50,
      confidence: aiResult.confidence || 0,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address || location_name || `${latitude}, ${longitude}`
      },
      status: aiResult.severity === 'critical' ? 'investigating' : 'detected',
      detectedAt: new Date(aiResult.timestamp || Date.now()),
      detectedBy: req.user.id,
      source: 'satellite_analysis',
      spectralIndices: aiResult.spectral_indices || {},
      affectedAreaHectares: aiResult.affected_area_hectares || 0,
      requiredAction: aiResult.required_action || '',
      aiReportId: aiResult.report_id,
      satelliteAnalysis: {
        processingTimeMs: aiResult.processing_time_ms,
        imageFilename: file.originalname,
        spectralIndices: aiResult.spectral_indices
      }
    };

    const violation = await Violation.create(violationData);

    console.log(`✅ Satellite violation created: ${violation._id}`);

    res.status(201).json({
      success: true,
      data: {
        violationId: violation._id,
        aiResult,
        violation: {
          id: violation._id,
          title: violation.title,
          crimeType: violation.crimeType,
          riskScore: violation.riskScore,
          location: violation.location,
          status: violation.status
        }
      }
    });
  } catch (error) {
    console.error('❌ Satellite analysis error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  detectCrime,
  batchDetectCrimes,
  getHotspots,
  getAIStats,
  getAIReports,
  checkAIHealth,
  receiveAIWebhook,
  analyzeSatelliteImage
};
