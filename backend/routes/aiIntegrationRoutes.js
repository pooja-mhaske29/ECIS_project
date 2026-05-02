const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  detectCrime,
  batchDetectCrimes,
  getHotspots,
  getAIStats,
  getAIReports,
  checkAIHealth,
  receiveAIWebhook,
  analyzeSatelliteImage
} = require('../controllers/aiIntegrationController');

const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Health check - Public (no auth required)
router.get('/health', checkAIHealth);

// Webhook receiver - Public (no auth required for AI service to call)
router.post('/webhook', receiveAIWebhook);

// All other routes are protected
router.use(protect);

// Detection routes
router.post('/detect', detectCrime);                    // POST /api/ai-integration/detect
router.post('/batch-detect', batchDetectCrimes);       // POST /api/ai-integration/batch-detect
router.post('/satellite/analyze', upload.single('file'), analyzeSatelliteImage);  // POST /api/ai-integration/satellite/analyze

// Information routes
router.get('/hotspots', getHotspots);                  // GET /api/ai-integration/hotspots
router.get('/stats', getAIStats);                      // GET /api/ai-integration/stats
router.get('/reports', getAIReports);                  // GET /api/ai-integration/reports

module.exports = router;
