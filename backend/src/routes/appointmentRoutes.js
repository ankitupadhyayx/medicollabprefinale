const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { 
  bookAppointment, 
  getPatientAppointments, 
  getHospitalAppointments, 
  updateStatus 
} = require('../controllers/appointmentController');

// Patient Routes
router.post('/book', protect, roleCheck('PATIENT'), bookAppointment);
router.get('/patient', protect, roleCheck('PATIENT'), getPatientAppointments);

// Hospital Routes
router.get('/hospital', protect, roleCheck('HOSPITAL'), getHospitalAppointments);
router.patch('/:id/status', protect, roleCheck('HOSPITAL'), updateStatus);

module.exports = router;