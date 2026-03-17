const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createViolation,
  getViolations,
  getAnalytics
} = require('../controllers/violationController');

// All violation routes are protected
router.use(protect); // This applies protect middleware to all routes below

// Routes
router.post('/', createViolation);        // POST /api/violations
router.get('/', getViolations);            // GET /api/violations
router.get('/analytics', getAnalytics);    // GET /api/violations/analytics

module.exports = router;