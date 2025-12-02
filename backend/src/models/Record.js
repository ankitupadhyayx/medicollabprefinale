const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    recordType: {
      type: String,
      enum: ['Lab Report', 'Prescription', 'Imaging', 'Discharge Summary', 'Bill', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    rejectionReason: {
      type: String,
    },
    files: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    metadata: {
      doctorName: String,
      department: String,
      dateOfVisit: Date,
      diagnosis: String,
      medications: [String],
      testResults: mongoose.Schema.Types.Mixed,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
recordSchema.index({ patient: 1, status: 1 });
recordSchema.index({ hospital: 1, status: 1 });
recordSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Record', recordSchema);