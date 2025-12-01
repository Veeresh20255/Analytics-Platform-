const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['promote', 'demote', 'delete', 'create'], required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetUserEmail: { type: String },
  details: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
