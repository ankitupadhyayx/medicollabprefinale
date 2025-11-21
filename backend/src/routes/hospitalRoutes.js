const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getProfile, updateProfile, getPatients } = require('../controllers/hospitalController');

router.use(protect);
router.use(roleCheck('HOSPITAL'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/patients', getPatients);

module.exports = router;