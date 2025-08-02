const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the Dataset model
const Dataset = require('../models/Dataset');
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

const uploadRealData = async () => {
  const csvDirectory = path.join(__dirname, '../uploads/csv-files');
  
  // Get admin user for createdBy field
  const adminUser = await User.findOne({ email: 'admin@statsofindia.com' });
  if (!adminUser) {
    console.error('❌ Admin user not found. Please run seed:datasets first.');
    process.exit(1);
  }
  
  // Categories for organizing data
  const categories = ['demographics', 'education', 'economy', 'health', 'agriculture', 'infrastructure'];
  
  console.log('🚀 Starting bulk upload of CSV files...');
  console.log(`📁 Scanning directory: ${csvDirectory}`);
  
  let totalUploaded = 0;
  let totalErrors = 0;
  
  for (const category of categories) {
    const categoryPath = path.join(csvDirectory, category);
    
    if (fs.existsSync(categoryPath)) {
      console.log(`\n📂 Processing category: ${category}`);
      
      const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.csv'));
      
      if (files.length === 0) {
        console.log(`   ⚠️  No CSV files found in ${category}`);
        continue;
      }
      
      for (const file of files) {
        try {
          const filePath = path.join(categoryPath, file);
          const stats = fs.statSync(filePath);
          
          // Generate a meaningful title from filename
          const title = file
            .replace('.csv', '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          
          // Check if dataset already exists
          const existingDataset = await Dataset.findOne({
            title: title,
            category: category
          });
          
          if (existingDataset) {
            console.log(`   ⚠️  Dataset already exists: ${title}`);
            continue;
          }
          
          // Create dataset entry with correct field names
          const dataset = new Dataset({
            title: title,
            description: `Real ${category} data from ${file}`,
            category: category,
            state: 'all-india',
            year: new Date().getFullYear(),
            source: 'Your Data Source',
            sourceUrl: '',
            dataQuality: 'verified',
            tags: [category, 'real-data'],
            metadata: {
              totalRecords: 0, // Will be calculated from CSV
              fileSize: stats.size,
              lastUpdated: new Date(),
              updateFrequency: 'yearly',
              coverage: 'state',
              timeSeries: false,
              timeRange: {
                start: new Date().getFullYear(),
                end: new Date().getFullYear()
              }
            },
            files: [{
              fileName: file,
              originalName: file,
              fileType: 'csv',
              fileSize: stats.size,
              filePath: filePath,
              mimeType: 'text/csv',
              uploadedAt: new Date(),
              isActive: true,
              downloadCount: 0
            }],
            statistics: {
              downloadCount: 0,
              viewCount: 0,
              rating: {
                average: 0,
                count: 0
              },
              lastDownloaded: null
            },
            isPublic: true,
            isActive: true,
            createdBy: adminUser._id
          });
          
          await dataset.save();
          console.log(`   ✅ Uploaded: ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
          totalUploaded++;
          
        } catch (error) {
          console.error(`   ❌ Error uploading ${file}:`, error.message);
          totalErrors++;
        }
      }
    } else {
      console.log(`   📁 Category directory not found: ${category}`);
    }
  }
  
  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${totalUploaded} files`);
  console.log(`   ❌ Errors: ${totalErrors} files`);
  console.log(`   📁 Total processed: ${totalUploaded + totalErrors} files`);
};

const main = async () => {
  try {
    await connectDB();
    await uploadRealData();
    
    console.log('\n🎉 Bulk upload completed successfully!');
    console.log('🌐 You can now view your data at: http://localhost:3000/data-portal');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
};

// Run the script
main(); 