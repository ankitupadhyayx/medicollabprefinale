const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth'); // ✅ Fix

const Dispute = require('../models/Dispute');
const Record = require('../models/Record');
const { logAudit } = require('../utils/auditLogger');
const { analyzeDispute } = require('../services/aiService');

router.post('/create', authenticate, authorize, async (req, res) => {
  try {
    const { recordId, hospitalId, reason, description, evidence } = req.body;

    // Verify record exists
    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Create dispute
    const dispute = new Dispute({
      recordId,
      patientId: req.user.userId,
      hospitalId: hospitalId || record.hospitalId,
      reason,
      description,
      evidence,
      priority: determinePriority(reason),
      timeline: [{
        action: 'CREATED',
        performedBy: req.user.userId,
        notes: 'Dispute filed by patient'
      }]
    });

    // Get AI analysis
    try {
      const aiAnalysis = await analyzeDispute(dispute);
      dispute.aiAnalysis = aiAnalysis;
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
    }

    await dispute.save();

    await logAudit({
      action: 'DISPUTE_CREATE',
      performedBy: req.user.userId,
      targetResource: {
        resourceType: 'Dispute',
        resourceId: dispute._id
      },
      severity: 'WARNING',
      req
    });

    res.status(201).json({
      message: 'Dispute created successfully',
      dispute
    });
  } catch (error) {
    console.error('Error creating dispute:', error);
    res.status(500).json({ message: 'Failed to create dispute' });
  }
});

const determinePriority = (reason) => {
  const highPriorityReasons = ['PRIVACY_VIOLATION', 'DATA_BREACH', 'UNAUTHORIZED_UPLOAD'];
  return highPriorityReasons.includes(reason) ? 'HIGH' : 'MEDIUM';
};

module.exports = router;