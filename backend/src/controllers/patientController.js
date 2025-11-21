const User = require('../models/User');
const Reminder = require('../models/Reminder');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ patient: req.user._id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create({
      patient: req.user._id,
      ...req.body
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch verified hospitals for dropdown
exports.getVerifiedHospitals = async (req, res) => {
    try {
        const hospitals = await User.find({ 
            role: 'HOSPITAL', 
            verifiedStatus: 'Verified' 
        }).select('name hospitalName address specialization');
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};