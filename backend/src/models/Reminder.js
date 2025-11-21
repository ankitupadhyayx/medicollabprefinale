const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['MEDICINE', 'CHECKUP'], required: true },
  title: { type: String, required: true },
  description: String,
  frequency: String, // e.g., "Daily", "Weekly"
  status: { 
    type: String, 
    enum: ['ONGOING', 'COMPLETED', 'REFILL_NEEDED', 'UPCOMING'], 
    default: 'ONGOING' 
  },
  nextDue: Date
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);