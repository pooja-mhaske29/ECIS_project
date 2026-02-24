const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createViolation,
  getViolations,
  getViolationById,
  getAnalytics
} = require("../controllers/violationController");

// Routes
router.post("/", authMiddleware, createViolation);
router.get("/", authMiddleware, getViolations);
router.get("/analytics/summary", authMiddleware, getAnalytics);
router.get("/:id", authMiddleware, getViolationById);

module.exports = router;