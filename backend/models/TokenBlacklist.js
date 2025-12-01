const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revokedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true } // When token naturally expires
});

// Auto-delete expired tokens 24 hours after expiry
TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
