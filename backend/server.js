const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploads');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const fs = require('fs');
const multer = require('multer');
const Papa = require('papaparse');
const stockRoutes = require('./routes/stocks');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
connectDB();

app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const upload = multer({ dest: 'uploads/'});

app.post('/upload', upload.single('file'), (req, res) =>{
  const filePath = req.file.path;
  const ext = req.file.originalname.split('.').pop();

  let data = [];

  try {
    if (ext === 'xlsx') {
      const workbook = xlsx.readfile(filepath);
      const sheetName = workbook.Sheets[workbook.SheetName[0]];
      data = xlsx.utils.sheet_to_json(sheetName);
    }
    else if(ext === 'csv') {
      const file = fs.readFileSync(filePath, 'utf-8');
      const parsed = Papa.parse(fiel, { header: true });
      data = parsed.data;
    }

    else if(ext === 'json') {
      const file = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(file);
    }
     
    res.json(data);
  }catch (err) {
    res.status(500).json({ error: 'Parsing error'});
  }
  
});

// Set Content-Type header
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ensure uploads dir exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboards', require('./routes/dashboard'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
