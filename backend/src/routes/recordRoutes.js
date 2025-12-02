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
const upload = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users)
router.get('/', getRecords);
router.get('/stats', getRecordStats);
router.get('/:id', getRecordById);

// Hospital routes - Use upload.any() to accept any files and parse all fields
router.post(
  '/', 
  authorize('HOSPITAL'), 
  upload.any(), // This will parse both files AND text fields
  createRecord
);

router.put('/:id', authorize('HOSPITAL', 'ADMIN'), updateRecord);
router.delete('/:id', authorize('HOSPITAL', 'ADMIN'), deleteRecord);

// Patient routes
router.put('/:id/status', authorize('PATIENT'), updateRecordStatus);

module.exports = router;