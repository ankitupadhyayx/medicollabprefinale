const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  targetType: String,
  targetId: String,
  ipAddress: String,
  result: { type: String, enum: ['Secure', 'Failed Attempt', 'Restricted Attempt'], default: 'Secure' }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);