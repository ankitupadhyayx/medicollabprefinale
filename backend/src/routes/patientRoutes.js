const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { 
    getProfile, 
    updateProfile, 
    getReminders, 
    createReminder, 
    getVerifiedHospitals 
} = require('../controllers/patientController');

router.use(protect);
router.use(roleCheck('PATIENT'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/reminders', getReminders);
router.post('/reminders', createReminder);
router.get('/verified-hospitals', getVerifiedHospitals);

module.exports = router;