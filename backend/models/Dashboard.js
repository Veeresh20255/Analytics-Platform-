const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    config: { type: Object, required: true }
  },
  { timestamps: true }
);

// Add compound index for faster queries by user and name
DashboardSchema.index({ user: 1, name: 1 }, { unique: false });

// Optional: index createdAt for sorting recent dashboards quickly
DashboardSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Dashboard', DashboardSchema);