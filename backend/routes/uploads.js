const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('sheetjs-style'); // SheetJS
const Upload = require('../models/Upload');
const { auth, optionalAuth } = require('../middleware/auth');

// ---------------------- Multer Setup ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.xls', '.xlsx', '.csv'].includes(ext)) {
      return cb(new Error('Only Excel (.xls/.xlsx) and CSV (.csv) files are allowed'));
    }
    cb(null, true);
  },
});

// ---------------------- Upload Endpoint ----------------------
router.post('/upload', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let jsonData = [];
    let firstSheetName = req.file.originalname;

    if (ext === '.csv') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const wb = XLSX.read(fileContent, { type: 'string' });
      firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });
    } else {
      const wb = XLSX.readFile(filePath);
      firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });
    }

    if (jsonData.length === 0) {
      return res.status(400).json({ message: 'Uploaded file is empty' });
    }

    const doc = new Upload({
      user: req.user ? req.user.id : null,
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: filePath,
      sheetName: firstSheetName,
      dataJson: jsonData,
    });

    await doc.save();
    res.status(201).json({ upload: doc });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to parse uploaded file' });
  }
});

// ---------------------- User Upload History ----------------------
router.get('/history', auth, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ uploads });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ---------------------- Admin: List All Uploads ----------------------
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const uploads = await Upload.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ uploads });
  } catch (err) {
    console.error('Admin uploads error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;