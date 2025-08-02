const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

const resetAdminPassword = async () => {
  try {
    console.log('🔑 Resetting admin password...');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@statsofindia.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Update admin password
    await adminUser.updateOne({
      password: hashedPassword,
      isActive: true,
      loginAttempts: 0,
      lockUntil: null
    });
    
    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email: admin@statsofindia.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Failed to reset admin password:', error);
  }
};

const main = async () => {
  try {
    await connectDB();
    await resetAdminPassword();
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
};

main(); 