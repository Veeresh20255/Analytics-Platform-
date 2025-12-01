require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/excel_analytics';
const adminEmail = 'admin@example.com';

async function rotateAdminPassword() {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.error('Admin user not found.');
      process.exit(1);
    }

    const newPassword = Math.random().toString(36).slice(-8); // Generate a random password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedNewPassword;
    await admin.save();

    console.log(`Admin password rotated successfully.`);
    console.log(`New credentials: ${adminEmail} / ${newPassword}`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Error rotating admin password:', err);
    process.exit(1);
  }
}

rotateAdminPassword();
