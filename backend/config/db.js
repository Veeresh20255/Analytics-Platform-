const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/excel_analytics';

    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI is not set. Falling back to mongodb://localhost:27017/excel_analytics');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
