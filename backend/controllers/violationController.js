const Violation = require('../models/Violation');

// @desc    Create a new violation
// @route   POST /api/violations
// @access  Private
const createViolation = async (req, res) => {
  try {
    const { title, description, crimeType, riskScore, confidence, location } = req.body;

    // Validation
    if (!title || !description || !crimeType || !riskScore || !confidence || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Validate coordinates
    if (!location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide valid coordinates [longitude, latitude]' 
      });
    }

    // Add detectedBy from authenticated user
    const violationData = {
      ...req.body,
      detectedBy: req.user.id
    };

    const violation = await Violation.create(violationData);

    res.status(201).json({
      success: true,
      data: violation
    });
  } catch (error) {
    console.error('Create violation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all violations
// @route   GET /api/violations
// @access  Private
const getViolations = async (req, res) => {
  try {
    // Build query
    const query = {};
    
    // Filter by crimeType if provided
    if (req.query.crimeType) {
      query.crimeType = req.query.crimeType;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by risk score range
    if (req.query.minRisk) {
      query.riskScore = { ...query.riskScore, $gte: parseInt(req.query.minRisk) };
    }
    if (req.query.maxRisk) {
      query.riskScore = { ...query.riskScore, $lte: parseInt(req.query.maxRisk) };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const violations = await Violation.find(query)
      .populate('detectedBy', 'name email')
      .sort({ detectedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Violation.countDocuments(query);

    res.json({
      success: true,
      count: violations.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: violations
    });
  } catch (error) {
    console.error('Get violations error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get analytics
// @route   GET /api/violations/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    // Get total count
    const total = await Violation.countDocuments();

    // Get counts by crime type
    const crimeTypeStats = await Violation.aggregate([
      {
        $group: {
          _id: '$crimeType',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$riskScore' },
          avgConfidence: { $avg: '$confidence' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get counts by status
    const statusStats = await Violation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get risk level distribution
    const riskLevels = {
      high: await Violation.countDocuments({ riskScore: { $gte: 70 } }),
      medium: await Violation.countDocuments({ riskScore: { $gte: 40, $lt: 70 } }),
      low: await Violation.countDocuments({ riskScore: { $lt: 40 } })
    };

    // Get monthly trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyTrend = await Violation.aggregate([
      {
        $match: {
          detectedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$detectedAt' },
            month: { $month: '$detectedAt' },
            day: { $dayOfMonth: '$detectedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get recent violations (last 5)
    const recentViolations = await Violation.find()
      .sort({ detectedAt: -1 })
      .limit(5)
      .select('title crimeType riskScore status detectedAt');

    res.json({
      success: true,
      data: {
        overview: {
          total,
          riskLevels
        },
        crimeTypeStats,
        statusStats,
        monthlyTrend,
        recentViolations
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  createViolation,
  getViolations,
  getAnalytics
};