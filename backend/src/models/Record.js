const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/crypto');

const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  type: { 
    type: String, 
    enum: ['Lab Report', 'Prescription', 'Bill', 'Imaging', 'Discharge Summary'],
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String }, // Encrypted
  
  fileUrl: { type: String, required: true },
  filePublicId: { type: String }, 
  
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  
  aiVerified: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

// Hooks for Encryption/Decryption
recordSchema.pre('save', function(next) {
  if (this.isModified('description') && this.description) {
    this.description = encrypt(this.description);
  }
  next();
});

recordSchema.post(['find', 'findOne'], function(docs) {
  if (!docs) return;
  const decryptDoc = (doc) => {
    if (doc && doc.description && doc.description.includes(':')) {
      doc.description = decrypt(doc.description);
    }
  };
  if (Array.isArray(docs)) {
    docs.forEach(decryptDoc);
  } else {
    decryptDoc(docs);
  }
});

module.exports = mongoose.model('Record', recordSchema);