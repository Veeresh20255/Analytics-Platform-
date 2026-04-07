const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const XLSX = require('sheetjs-style');
const Upload = require('../models/Upload');
const { auth, optionalAuth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// upload excel
router.post('/upload', optionalAuth, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request - user:', req.user ? req.user.id : 'guest');
    const filePath = req.file.path;
    const wb = XLSX.readFile(filePath);
    const firstSheet = wb.SheetNames[0];
    const sheet = wb.Sheets[firstSheet];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const doc = new Upload({
      user: req.user ? req.user.id : null,  // Set to user ID if authenticated, else null for guests
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: filePath,
      sheetName: firstSheet,
      dataJson: json,
    });

    await doc.save();

    // return saved upload doc
    res.json({ upload: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get user's upload history
router.get('/history', auth, async (req, res) => {
  console.log('History request for user:', req.user.id);
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log('Found uploads:', uploads.length);
    res.json({ uploads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// admin: list all uploads
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const uploads = await Upload.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ uploads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
