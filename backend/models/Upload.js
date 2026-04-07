const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalName: String,
  filename: String,
  path: String,
  sheetName: String,
  dataJson: Array,
  aiInsights: String,
}, { timestamps: true });

UploadSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Upload', UploadSchema);