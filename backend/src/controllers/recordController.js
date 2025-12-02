const Record = require('../models/Record');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Create new record with file upload (Hospital only)
exports.createRecord = async (req, res) => {
  try {
    // Extract fields from FormData
    const title = req.body.title;
    const description = req.body.description;
    const patientEmail = req.body.patientEmail;
    const recordType = req.body.recordType || 'Other';
    const metadata = req.body.metadata;

    console.log('🚀 Creating record:', { 
      title, 
      patientEmail, 
      recordType,
      hasFiles: req.files ? req.files.length : 0,
      body: req.body 
    });

    // Validate required fields
    if (!title || !description || !patientEmail) {
      return res.status(400).json({ 
        message: 'Title, description, and patient email are required' 
      });
    }

    // Validate hospital user
    if (req.user.role !== 'HOSPITAL') {
      return res.status(403).json({ message: 'Only hospitals can create records' });
    }

    // Find patient by email
    const patient = await User.findOne({ email: patientEmail, role: 'PATIENT' });
    if (!patient) {
      // Delete uploaded files if patient not found
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        }
      }
      return res.status(404).json({ message: 'Patient not found with this email' });
    }

    // Process uploaded files
    const files = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        files.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: `/uploads/${file.filename}`,
          uploadedAt: new Date(),
        });
      }
      console.log(`📎 ${files.length} file(s) uploaded`);
    }

    // Create record
    const record = await Record.create({
      title,
      description,
      patient: patient._id,
      hospital: req.user._id,
      hospitalName: req.user.hospitalName || req.user.name,
      recordType,
      files,
      metadata,
    });

    // Populate references
    await record.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'hospital', select: 'name email phone hospitalName' },
    ]);

    console.log('✅ Record created:', record._id);

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      record,
    });
  } catch (error) {
    console.error('❌ Create record error:', error);
    
    // Delete uploaded files if record creation fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    }
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get all records (filtered by role)
exports.getRecords = async (req, res) => {
  try {
    const { status, recordType, search } = req.query;

    let query = { isDeleted: false };

    // Filter by role
    if (req.user.role === 'PATIENT') {
      query.patient = req.user._id;
    } else if (req.user.role === 'HOSPITAL') {
      query.hospital = req.user._id;
    }

    // Additional filters
    if (status) query.status = status;
    if (recordType) query.recordType = recordType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const records = await Record.find(query)
      .populate('patient', 'name email phone')
      .populate('hospital', 'name email phone hospitalName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.error('❌ Get records error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single record by ID
exports.getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('hospital', 'name email phone hospitalName');

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check authorization
    const isPatient = req.user.role === 'PATIENT' && record.patient._id.toString() === req.user._id.toString();
    const isHospital = req.user.role === 'HOSPITAL' && record.hospital._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isPatient && !isHospital && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this record' });
    }

    res.json({ success: true, record });
  } catch (error) {
    console.error('❌ Get record error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update record status (Patient only - Approve/Reject)
exports.updateRecordStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Only patients can approve/reject records' });
    }

    const record = await Record.findById(req.params.id);

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check if patient owns this record
    if (record.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be APPROVED or REJECTED' });
    }

    // If rejecting, reason is required
    if (status === 'REJECTED' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    record.status = status;
    if (status === 'REJECTED') {
      record.rejectionReason = rejectionReason;
    }

    await record.save();

    await record.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'hospital', select: 'name email phone hospitalName' },
    ]);

    console.log(`✅ Record ${status.toLowerCase()}: ${record._id}`);

    res.json({
      success: true,
      message: `Record ${status.toLowerCase()} successfully`,
      record,
    });
  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update record (Hospital only)
exports.updateRecord = async (req, res) => {
  try {
    if (req.user.role !== 'HOSPITAL' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only hospitals can update records' });
    }

    const record = await Record.findById(req.params.id);

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check if hospital owns this record
    if (req.user.role === 'HOSPITAL' && record.hospital.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    const { title, description, recordType, metadata } = req.body;

    if (title) record.title = title;
    if (description) record.description = description;
    if (recordType) record.recordType = recordType;
    if (metadata) record.metadata = { ...record.metadata, ...metadata };

    await record.save();

    await record.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'hospital', select: 'name email phone hospitalName' },
    ]);

    res.json({ success: true, message: 'Record updated successfully', record });
  } catch (error) {
    console.error('❌ Update record error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete record (Hospital/Admin only)
exports.deleteRecord = async (req, res) => {
  try {
    if (req.user.role !== 'HOSPITAL' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only hospitals/admins can delete records' });
    }

    const record = await Record.findById(req.params.id);

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check if hospital owns this record
    if (req.user.role === 'HOSPITAL' && record.hospital.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }

    record.isDeleted = true;
    await record.save();

    console.log(`✅ Record deleted: ${record._id}`);

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('❌ Delete record error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get record statistics
exports.getRecordStats = async (req, res) => {
  try {
    let query = { isDeleted: false };

    if (req.user.role === 'PATIENT') {
      query.patient = req.user._id;
    } else if (req.user.role === 'HOSPITAL') {
      query.hospital = req.user._id;
    }

    const [total, approved, pending, rejected] = await Promise.all([
      Record.countDocuments(query),
      Record.countDocuments({ ...query, status: 'APPROVED' }),
      Record.countDocuments({ ...query, status: 'PENDING' }),
      Record.countDocuments({ ...query, status: 'REJECTED' }),
    ]);

    let hospitalsVisited = 0;
    if (req.user.role === 'PATIENT') {
      hospitalsVisited = await Record.distinct('hospital', query).then((ids) => ids.length);
    }

    res.json({
      success: true,
      stats: {
        total,
        approved,
        pending,
        rejected,
        hospitalsVisited,
      },
    });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
};