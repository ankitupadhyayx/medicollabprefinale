const express = require('express');
const router = express.Router();
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecordStatus,
  updateRecord,
  deleteRecord,
  getRecordStats,
} = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users)
router.get('/', getRecords);
router.get('/stats', getRecordStats);
router.get('/:id', getRecordById);

// Hospital routes
router.post('/', authorize('HOSPITAL'), createRecord);
router.put('/:id', authorize('HOSPITAL', 'ADMIN'), updateRecord);
router.delete('/:id', authorize('HOSPITAL', 'ADMIN'), deleteRecord);

// Patient routes
router.put('/:id/status', authorize('PATIENT'), updateRecordStatus);

module.exports = router;