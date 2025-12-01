const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'superuser') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
