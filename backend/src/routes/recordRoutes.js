const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const { uploadRecord, getPendingRecords, getTimeline, updateStatus } = require('../controllers/recordController');

router.post('/upload', protect, roleCheck('HOSPITAL'), upload.single('file'), uploadRecord);
router.get('/pending', protect, roleCheck('PATIENT'), getPendingRecords);
router.get('/timeline', protect, roleCheck('PATIENT'), getTimeline);
router.patch('/:id/approve', protect, roleCheck('PATIENT'), (req, res) => {
    req.body.status = 'APPROVED';
    updateStatus(req, res);
});
router.patch('/:id/reject', protect, roleCheck('PATIENT'), (req, res) => {
    req.body.status = 'REJECTED';
    updateStatus(req, res);
});

module.exports = router;