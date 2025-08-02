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
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
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
  dataQuality: {
    type: String,
    enum: ['verified', 'pending', 'unverified'],
    default: 'pending',
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  metadata: {
    totalRecords: {
      type: Number,
      default: 0
    },
    fileSize: {
      type: Number, // in bytes
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    updateFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'decennial', 'seasonal', 'on-demand'],
      default: 'yearly'
    },
    coverage: {
      type: String,
      enum: ['national', 'state', 'district', 'city', 'village'],
      default: 'state'
    },
    timeSeries: {
      type: Boolean,
      default: false
    },
    timeRange: {
      start: {
        type: Number,
        min: 1900
      },
      end: {
        type: Number,
        max: 2030
      }
    }
  },
  files: [{
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileType: {
      type: String,
      required: true,
      enum: ['csv', 'pdf', 'xlsx', 'json', 'xml', 'txt', 'zip']
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0
    },
    filePath: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    checksum: {
      type: String,
      trim: true
    }
  }],
  statistics: {
    downloadCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    lastDownloaded: {
      type: Date,
      default: null
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
datasetSchema.index({ category: 1, state: 1, year: 1 });
datasetSchema.index({ category: 1, isActive: 1 });
datasetSchema.index({ state: 1, isActive: 1 });
datasetSchema.index({ year: 1, isActive: 1 });
datasetSchema.index({ 'statistics.downloadCount': -1 });
datasetSchema.index({ 'statistics.rating.average': -1 });
datasetSchema.index({ createdAt: -1 });

// Virtual for formatted file size
datasetSchema.virtual('formattedFileSize').get(function() {
  const bytes = this.metadata.fileSize;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for active files count
datasetSchema.virtual('activeFilesCount').get(function() {
  return this.files.filter(file => file.isActive).length;
});

// Virtual for total file size
datasetSchema.virtual('totalFileSize').get(function() {
  return this.files.reduce((total, file) => total + file.fileSize, 0);
});

// Method to increment download count
datasetSchema.methods.incrementDownloadCount = function(fileId) {
  this.statistics.downloadCount += 1;
  this.statistics.lastDownloaded = new Date();
  
  if (fileId) {
    const file = this.files.id(fileId);
    if (file) {
      file.downloadCount += 1;
    }
  }
  
  return this.save();
};

// Method to increment view count
datasetSchema.methods.incrementViewCount = function() {
  this.statistics.viewCount += 1;
  return this.save();
};

// Method to add rating
datasetSchema.methods.addRating = function(rating) {
  const currentTotal = this.statistics.rating.average * this.statistics.rating.count;
  this.statistics.rating.count += 1;
  this.statistics.rating.average = (currentTotal + rating) / this.statistics.rating.count;
  return this.save();
};

// Method to get active files
datasetSchema.methods.getActiveFiles = function() {
  return this.files.filter(file => file.isActive);
};

// Method to get files by type
datasetSchema.methods.getFilesByType = function(fileType) {
  return this.files.filter(file => file.isActive && file.fileType === fileType);
};

// Static method to find datasets by category
datasetSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, isActive: true, isPublic: true };
  return this.find(query, options);
};

// Static method to find datasets by state
datasetSchema.statics.findByState = function(state, options = {}) {
  const query = { state, isActive: true, isPublic: true };
  return this.find(query, options);
};

// Static method to find datasets by year
datasetSchema.statics.findByYear = function(year, options = {}) {
  const query = { year, isActive: true, isPublic: true };
  return this.find(query, options);
};

// Static method to find popular datasets
datasetSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true, isPublic: true })
    .sort({ 'statistics.downloadCount': -1 })
    .limit(limit);
};

// Static method to find recent datasets
datasetSchema.statics.findRecent = function(limit = 10) {
  return this.find({ isActive: true, isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search datasets
datasetSchema.statics.search = function(searchTerm, options = {}) {
  const query = {
    isActive: true,
    isPublic: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  return this.find(query, options);
};

module.exports = mongoose.model('Dataset', datasetSchema); 