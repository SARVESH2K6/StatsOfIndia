const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Dataset = require('../models/Dataset');

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

const cleanDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Remove all datasets
    const datasetResult = await Dataset.deleteMany({});
    console.log(`🗑️  Removed ${datasetResult.deletedCount} datasets`);
    
    // Remove all users except admin
    const userResult = await User.deleteMany({ email: { $ne: 'admin@statsofindia.com' } });
    console.log(`🗑️  Removed ${userResult.deletedCount} users (keeping admin)`);
    
    // Create fresh admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@statsofindia.com' });
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = new User({
        fullName: 'Admin User',
        email: 'admin@statsofindia.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isVerified: true
      });
      
      await adminUser.save();
      console.log('👤 Created admin user: admin@statsofindia.com / admin123');
    } else {
      console.log('👤 Admin user already exists');
    }
    
    console.log('\n✅ Database cleaned successfully!');
    console.log('📊 Database now contains:');
    console.log('   - Clean datasets collection');
    console.log('   - Admin user only');
    console.log('   - Ready for your real data');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  }
};

const main = async () => {
  try {
    await connectDB();
    await cleanDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
};

// Run the script
main(); 