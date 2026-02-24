const Violation = require("../models/Violation");

// Create Violation
exports.createViolation = async (req, res) => {
  try {
    const violation = await Violation.create(req.body);
    res.status(201).json(violation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Violations
exports.getViolations = async (req, res) => {
  try {
    const violations = await Violation.find().sort({ createdAt: -1 });
    res.json(violations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Violation
exports.getViolationById = async (req, res) => {
  try {
    const violation = await Violation.findById(req.params.id);
    if (!violation) {
      return res.status(404).json({ message: "Violation not found" });
    }
    res.json(violation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Basic Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const total = await Violation.countDocuments();
    const highRisk = await Violation.countDocuments({ riskScore: { $gte: 70 } });

    res.json({
      total,
      highRisk
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};