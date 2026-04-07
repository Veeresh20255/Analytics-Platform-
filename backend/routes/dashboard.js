const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard');
const { auth } = require('../middleware/auth');

// ------------------ 💾 SAVE DASHBOARD ------------------
router.post('/save', auth, async (req, res) => {
  try {
    if (!req.body.name || !req.body.config) {
      return res.status(400).json({ message: 'Name and config are required' });
    }

    const dash = new Dashboard({
      user: req.user.id,
      name: req.body.name,
      config: req.body.config
    });

    await dash.save();

    res.json({ dashboard: dash });
  } catch (err) {
    console.error('Save dashboard error:', err);
    res.status(500).json({ message: 'Failed to save dashboard' });
  }
});

// ------------------ 📂 GET DASHBOARDS ------------------
router.get('/', auth, async (req, res) => {
  try {
    const dashboards = await Dashboard
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ dashboards });
  } catch (err) {
    console.error('Fetch dashboards error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboards' });
  }
});

// ------------------ ❌ DELETE DASHBOARD (BONUS) ------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const dash = await Dashboard.findById(req.params.id);

    if (!dash) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    // Only owner can delete
    if (dash.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await dash.deleteOne();

    res.json({ message: 'Dashboard deleted' });
  } catch (err) {
    console.error('Delete dashboard error:', err);
    res.status(500).json({ message: 'Failed to delete dashboard' });
  }
});

module.exports = router;