const User = require('../models/User');
const Dispute = require('../models/Dispute');
const AuditLog = require('../models/AuditLog');
const Record = require('../models/Record');

exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await User.find({ role: 'HOSPITAL' });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHospitalStatus = async (req, res) => {
  const { verifiedStatus } = req.body;
  try {
    const hospital = await User.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

    hospital.verifiedStatus = verifiedStatus;
    await hospital.save();

    await AuditLog.create({
      user: req.user._id,
      action: `HOSPITAL_${verifiedStatus.toUpperCase()}`,
      targetType: 'User',
      targetId: hospital._id
    });

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('record', 'title')
      .populate('patient', 'name')
      .populate('hospital', 'name');
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveDispute = async (req, res) => {
    try {
        const { status } = req.body;
        const dispute = await Dispute.findByIdAndUpdate(req.params.id, { status }, { new: true });
        
        await AuditLog.create({
            user: req.user._id,
            action: `DISPUTE_${status.toUpperCase()}`,
            targetType: 'Dispute',
            targetId: dispute._id
        });

        res.json(dispute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalPatients: await User.countDocuments({ role: 'PATIENT' }),
      totalHospitals: await User.countDocuments({ role: 'HOSPITAL' }),
      pendingHospitals: await User.countDocuments({ role: 'HOSPITAL', verifiedStatus: 'Pending' }),
      totalRecords: await Record.countDocuments({}),
      pendingDisputes: await Dispute.countDocuments({ status: 'Pending Review' })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('user', 'name role')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};