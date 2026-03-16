const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createViolation,
  getViolations,
  getViolationById,
  updateViolation,
  deleteViolation,
  getAnalytics,
  getNearbyViolations,
  getViolationsByDateRange,
  updateViolationStatus,
  getViolationsByRiskLevel,
  bulkCreateViolations
} = require("../controllers/violationController");

// Special routes first (to avoid :id conflicts)
router.get("/analytics", protect, getAnalytics);
router.get("/nearby", protect, getNearbyViolations);
router.get("/by-date", protect, getViolationsByDateRange);
router.get("/by-risk/:level", protect, getViolationsByRiskLevel);
router.post("/bulk", protect, bulkCreateViolations);

// CRUD routes
router.route("/")
  .get(protect, getViolations)
  .post(protect, createViolation);

router.route("/:id")
  .get(protect, getViolationById)
  .put(protect, updateViolation)
  .delete(protect, deleteViolation);

// Status update
router.patch("/:id/status", protect, updateViolationStatus);

module.exports = router;