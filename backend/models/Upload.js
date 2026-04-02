const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  sheetName: { type: String, required: true },
  dataJson: { type: Array, required: true },
  aiInsights: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Upload', UploadSchema);
