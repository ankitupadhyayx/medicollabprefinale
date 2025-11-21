const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  record: { type: mongoose.Schema.Types.ObjectId, ref: 'Record', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: String,
  status: { 
    type: String, 
    enum: ['Pending Review', 'Resolved', 'Dismissed'], 
    default: 'Pending Review' 
  },
  aiSuggestion: String
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);