const Violation = require("../models/Violation");

// @desc    Create a new violation
// @route   POST /api/violations
exports.createViolation = async (req, res) => {
  try {
    const violation = await Violation.create(req.body);
    res.status(201).json({
      success: true,
      data: violation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all violations
// @route   GET /api/violations
exports.getViolations = async (req, res) => {
  try {
    const violations = await Violation.find().sort('-createdAt');
    res.json({
      success: true,
      count: violations.length,
      data: violations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single violation
// @route   GET /api/violations/:id
exports.getViolationById = async (req, res) => {
  try {
    const violation = await Violation.findById(req.params.id);
    if (!violation) {
      return res.status(404).json({
        success: false,
        message: "Violation not found"
      });
    }
    res.json({
      success: true,
      data: violation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update violation
// @route   PUT /api/violations/:id
exports.updateViolation = async (req, res) => {
  try {
    const violation = await Violation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!violation) {
      return res.status(404).json({
        success: false,
        message: "Violation not found"
      });
    }
    res.json({
      success: true,
      data: violation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete violation
// @route   DELETE /api/violations/:id
exports.deleteViolation = async (req, res) => {
  try {
    const violation = await Violation.findByIdAndDelete(req.params.id);
    if (!violation) {
      return res.status(404).json({
        success: false,
        message: "Violation not found"
      });
    }
    res.json({
      success: true,
      message: "Violation deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get analytics
// @route   GET /api/violations/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const total = await Violation.countDocuments();
    const highRisk = await Violation.countDocuments({ riskScore: { $gte: 70 } });
    const mediumRisk = await Violation.countDocuments({ riskScore: { $gte: 40, $lt: 70 } });
    const lowRisk = await Violation.countDocuments({ riskScore: { $lt: 40 } });

    res.json({
      success: true,
      data: {
        total,
        riskLevels: {
          high: highRisk,
          medium: mediumRisk,
          low: lowRisk
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get nearby violations
// @route   GET /api/violations/nearby
exports.getNearbyViolations = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: "Please provide longitude and latitude"
      });
    }

    const violations = await Violation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json({
      success: true,
      count: violations.length,
      data: violations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get violations by date range
// @route   GET /api/violations/by-date
exports.getViolationsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const violations = await Violation.find({
      detectedAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    res.json({
      success: true,
      count: violations.length,
      data: violations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update violation status
// @route   PATCH /api/violations/:id/status
exports.updateViolationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const violation = await Violation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!violation) {
      return res.status(404).json({
        success: false,
        message: "Violation not found"
      });
    }

    res.json({
      success: true,
      data: violation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get violations by risk level
// @route   GET /api/violations/by-risk/:level
exports.getViolationsByRiskLevel = async (req, res) => {
  try {
    const { level } = req.params;
    let query = {};

    if (level === 'high') {
      query.riskScore = { $gte: 70 };
    } else if (level === 'medium') {
      query.riskScore = { $gte: 40, $lt: 70 };
    } else if (level === 'low') {
      query.riskScore = { $lt: 40 };
    }

    const violations = await Violation.find(query).sort('-riskScore');

    res.json({
      success: true,
      count: violations.length,
      data: violations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Bulk create violations
// @route   POST /api/violations/bulk
exports.bulkCreateViolations = async (req, res) => {
  try {
    const violations = await Violation.insertMany(req.body.violations);
    res.status(201).json({
      success: true,
      count: violations.length,
      data: violations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};