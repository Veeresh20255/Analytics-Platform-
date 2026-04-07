require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/excel_analytics';

async function seed() {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const userEmail = 'user1@example.com';
    const userPassword = process.env.USER_PASSWORD || 'UserPass123!';

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      const admin = new User({ name: 'Admin User', email: adminEmail, password: hashed, role: 'superuser' });
      await admin.save();
      console.log(`Created admin: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`Admin already exists: ${adminEmail}`);
    }

    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      const hashed2 = await bcrypt.hash(userPassword, 10);
      const user = new User({ name: 'Test User 1', email: userEmail, password: hashed2, role: 'user' });
      await user.save();
      console.log(`Created user: ${userEmail} / ${userPassword}`);
    } else {
      console.log(`User already exists: ${userEmail}`);
    }

    // Create additional test users with generated emails
    for (let i = 2; i <= 5; i++) {
      const genEmail = `user${i}@example.com`;
      const genPassword = `UserPass${i}23!`;
      const genName = `Test User ${i}`;

      const exists = await User.findOne({ email: genEmail });
      if (!exists) {
        const hashed = await bcrypt.hash(genPassword, 10);
        const user = new User({ name: genName, email: genEmail, password: hashed, role: 'user' });
        await user.save();
        console.log(`Created user: ${genEmail} / ${genPassword}`);
      } else {
        console.log(`User already exists: ${genEmail}`);
      }
    }

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
