const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

const auth = async function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader);
  const token = authHeader?.replace('Bearer ', '');
  console.log('Token after replace:', token);
  console.log('Auth middleware: token received =', !!token ? 'present' : 'missing');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Auth middleware: token verification failed', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const optionalAuth = async function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      // Check if token is blacklisted
      const blacklisted = await TokenBlacklist.findOne({ token });
      if (!blacklisted) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      }
    } catch (err) {
      // Ignore invalid tokens for optional auth
    }
  }
  next();
};

module.exports = { auth, optionalAuth };
