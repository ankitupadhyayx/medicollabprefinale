const User = require('../models/User');
const Record = require('../models/Record');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Calculate stats dynamically
    const stats = {
        totalPatients: 120, // Mock for now, or calculate via distinct patients in records
        recordsUploaded: await Record.countDocuments({ hospital: req.user._id }),
        doctorsCount: 15
    };
    
    res.json({ ...user.toObject(), stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatients = async (req, res) => {
    // In a real app, find patients who have records with this hospital
    // For simplicity in this stage, we return all patients
    try {
        const patients = await User.find({ role: 'PATIENT' }).select('-password');
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};