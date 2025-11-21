const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getPatientInsights, analyzeRecord } = require('../controllers/aiController');

router.post('/patient-insights', protect, getPatientInsights);
router.post('/analyze-record', protect, analyzeRecord);

module.exports = router;