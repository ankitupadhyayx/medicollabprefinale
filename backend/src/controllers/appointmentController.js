const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { hospitalId, date, time, reason } = req.body;

    const appointment = await Appointment.create({
      patient: req.user._id,
      hospital: hospitalId,
      date,
      time,
      reason,
      status: 'PENDING'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in patient's appointments
// @route   GET /api/appointments/patient
// @access  Private (Patient)
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('hospital', 'name hospitalName address')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in hospital's appointments
// @route   GET /api/appointments/hospital
// @access  Private (Hospital)
exports.getHospitalAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ hospital: req.user._id })
      .populate('patient', 'name email phone age gender')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private (Hospital)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // SCHEDULED, REJECTED, COMPLETED
    
    const appointment = await Appointment.findOne({ 
      _id: req.params.id, 
      hospital: req.user._id 
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};