const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Dataset title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Dataset description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['demographics', 'education', 'economy', 'health', 'agriculture'],
    index: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    enum: [
      'all-india', 'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 
      'chhattisgarh', 'goa', 'gujarat', 'haryana', 'himachal-pradesh', 
      'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 
      'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 
      'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura', 
      'uttar-pradesh', 'uttarakhand', 'west-bengal', 'delhi', 'chandigarh',
      'dadra-and-nagar-haveli', 'daman-and-diu', 'lakshadweep', 'puducherry',
      'andaman-and-nicobar-islands', 'jammu-and-kashmir', 'ladakh'
    ],
    index: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [2030, 'Year cannot exceed 2030'],
    index: true
  },
  source: {
    type: String,
    required: [true, 'Data source is required'],
    trim: true,
    maxlength: [200, 'Source cannot exceed 200 characters']
  },
  sourceUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  files: [{
    fileName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
datasetSchema.index({ category: 1, state: 1 });
datasetSchema.index({ year: 1 });
datasetSchema.index({ isPublic: 1, isActive: 1 });

module.exports = mongoose.model('Dataset', datasetSchema); 