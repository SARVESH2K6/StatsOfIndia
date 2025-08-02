const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Dataset = require('../models/Dataset');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stats-of-india')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testBookmark() {
  try {
    console.log('Testing bookmark functionality...');

    // Find a user and dataset
    const user = await User.findOne({});
    const dataset = await Dataset.findOne({});

    if (!user || !dataset) {
      console.log('No user or dataset found. Please create sample data first.');
      return;
    }

    console.log('User:', user.email);
    console.log('Dataset:', dataset.title);
    console.log('Current bookmarks:', user.bookmarks.length);

    // Test adding bookmark
    const existingBookmark = user.bookmarks.find(bookmark => 
      bookmark.datasetId.toString() === dataset._id.toString()
    );

    if (existingBookmark) {
      console.log('Bookmark already exists, removing...');
      user.bookmarks = user.bookmarks.filter(bookmark => 
        bookmark.datasetId.toString() !== dataset._id.toString()
      );
    } else {
      console.log('Adding bookmark...');
      user.bookmarks.push({
        datasetId: dataset._id,
        title: dataset.title,
        category: dataset.category,
        state: dataset.state,
        year: dataset.year,
        bookmarkedAt: new Date()
      });
    }

    await user.save();
    console.log('Updated bookmarks:', user.bookmarks.length);
    console.log('Bookmark test completed successfully!');

  } catch (error) {
    console.error('Bookmark test error:', error);
  } finally {
    process.exit(0);
  }
}

testBookmark(); 