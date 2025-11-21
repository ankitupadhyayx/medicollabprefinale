const Record = require('../models/Record');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// Upload (Hospital Only)
exports.uploadRecord = async (req, res) => {
  try {
    const { patientEmail, title, type, description } = req.body;
    
    // Find patient by email (assuming passed in body)
    const patient = await User.findOne({ email: patientEmail, role: 'PATIENT' });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const record = await Record.create({
      patient: patient._id,
      hospital: req.user._id,
      title,
      type,
      description,
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
      status: 'PENDING'
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'UPLOAD',
      targetType: 'Record',
      targetId: record._id,
      result: 'Secure'
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pending (Patient)
exports.getPendingRecords = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.user._id, status: 'PENDING' })
      .populate('hospital', 'name hospitalName');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject (Patient)
exports.updateStatus = async (req, res) => {
  const { status } = req.body; // APPROVED or REJECTED
  try {
    const record = await Record.findOne({ _id: req.params.id, patient: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    record.status = status;
    await record.save();

    await AuditLog.create({
      user: req.user._id,
      action: `RECORD_${status}`,
      targetType: 'Record',
      targetId: record._id,
      result: 'Secure'
    });

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Timeline (Patient)
exports.getTimeline = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.user._id, status: 'APPROVED' })
      .populate('hospital', 'name hospitalName')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};