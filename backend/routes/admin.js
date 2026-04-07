const express = require('express');
const User = require('../models/User');
const Upload = require('../models/Upload');
const AuditLog = require('../models/AuditLog');
const RefreshToken = require('../models/RefreshToken');
const TokenBlacklist = require('../models/TokenBlacklist');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bcrypt = require('bcryptjs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const router = express.Router();
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');

    // aggregate uploads by user
    const uploads = await Upload.aggregate([
      { $group: { _id: "$user", totalUploads: { $sum: 1 } } }
    ]);

    const usageMap = {};
    uploads.forEach(u => usageMap[u._id] = u.totalUploads);

    const result = users.map(user => ({
      ...user.toObject(),
      totalUploads: usageMap[user._id] || 0
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser.role === 'superuser') {
      return res.status(403).json({ message: 'Cannot delete superuser' });
    }
    await AuditLog.create({
      admin: req.user.id,
      action: 'delete',
      targetUser: req.params.id,
      targetUserEmail: targetUser.email,
      details: `Deleted user: ${targetUser.email}`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    await User.findByIdAndDelete(req.params.id);
    await Upload.deleteMany({ user: req.params.id }); // also delete uploads
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all uploads with user info
router.get('/uploads', auth, admin, async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// Admin-only route to list available generative AI models (for debugging)
router.get('/ai-models', auth, admin, async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (err) {
    console.error('Error listing AI models:', err);
    res.status(500).json({ message: err.message || 'Failed to list AI models' });
  }
});

// Admin-only route to promote a user to admin
router.post('/promote-user/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    await AuditLog.create({
      admin: req.user.id,
      action: 'promote',
      targetUser: req.params.id,
      targetUserEmail: user.email,
      details: `Promoted to admin: ${user.email}`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only route to demote a user to regular user
router.post('/demote-user/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'superuser') {
      return res.status(403).json({ message: 'Cannot demote superuser' });
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user' },
      { new: true }
    ).select('-password');
    await AuditLog.create({
      admin: req.user.id,
      action: 'demote',
      targetUser: req.params.id,
      targetUserEmail: user.email,
      details: `Demoted to user: ${user.email}`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    res.json({ message: 'User demoted to regular user', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only route to view audit logs
router.get('/audit-logs', auth, admin, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('admin', 'name email')
      .populate('targetUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only route to revoke/refresh user tokens (force logout all sessions)
router.post('/revoke-user-tokens/:id', auth, admin, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser.role === 'superuser' && req.user.id !== targetUser._id.toString()) {
      return res.status(403).json({ message: 'Cannot revoke superuser tokens' });
    }

    // Delete all refresh tokens for this user
    const deletedRefresh = await RefreshToken.deleteMany({ user: req.params.id });

    // Blacklist all active sessions for this user (add a generic blacklist entry)
    await TokenBlacklist.create({
      token: `revoked-all-${req.params.id}-${Date.now()}`,
      user: req.params.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    await AuditLog.create({
      admin: req.user.id,
      action: 'revoke',
      targetUser: req.params.id,
      targetUserEmail: targetUser.email,
      details: `Revoked all tokens for user: ${targetUser.email}`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      message: 'User tokens revoked successfully. User must login again.',
      refreshTokensDeleted: deletedRefresh.deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only route to get user session info
router.get('/user-sessions/:id', auth, admin, async (req, res) => {
  try {
    const refreshTokens = await RefreshToken.find({ user: req.params.id });
    const blacklistedTokens = await TokenBlacklist.find({ user: req.params.id });

    res.json({
      userId: req.params.id,
      activeSessions: refreshTokens.length,
      refreshTokens: refreshTokens.map(t => ({
        createdAt: t.createdAt,
        expiresAt: t.expiresAt
      })),
      revokedTokens: blacklistedTokens.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
