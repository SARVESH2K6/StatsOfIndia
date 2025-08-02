const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stats-of-india');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const unlockAdmin = async () => {
  try {
    console.log('🔓 Unlocking admin account...');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@statsofindia.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    // Reset login attempts and unlock account
    await adminUser.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 },
      $set: { 
        isActive: true,
        lastLogin: null
      }
    });
    
    console.log('✅ Admin account unlocked successfully!');
    console.log('📧 Email: admin@statsofindia.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Failed to unlock admin:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await unlockAdmin();
    process.exit(0);
  } catch (error) {
    console.error('❌ Unlock failed:', error);
    process.exit(1);
  }
};

main(); 