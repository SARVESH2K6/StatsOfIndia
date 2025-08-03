const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Dataset = require('../models/Dataset');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateDataset } = require('../middleware/validation');
const { parseCSVPreview, getCSVStats } = require('../utils/csvParser');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/datasets');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['csv', 'pdf', 'xlsx', 'json', 'xml', 'txt', 'zip'];
  const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// @route   GET /api/datasets
// @desc    Get all datasets with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      state,
      year,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true, isPublic: true };

    // Apply filters
    if (category) query.category = category;
    if (state) query.state = state;
    if (year) query.year = parseInt(year);
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const datasets = await Dataset.find(query)
      .populate('createdBy', 'fullName email')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Dataset.countDocuments(query);

    res.json({
      success: true,
      data: datasets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get datasets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching datasets'
    });
  }
});

// @route   GET /api/datasets/recent
// @desc    Get recent datasets
// @access  Public
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const datasets = await Dataset.findRecent(parseInt(limit))
      .populate('createdBy', 'fullName email');

    res.json({
      success: true,
      data: datasets
    });
  } catch (error) {
    console.error('Get recent datasets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent datasets'
    });
  }
});

// @route   GET /api/datasets/popular
// @desc    Get popular datasets
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const datasets = await Dataset.findPopular(parseInt(limit))
      .populate('createdBy', 'fullName email');

    res.json({
      success: true,
      data: datasets
    });
  } catch (error) {
    console.error('Get popular datasets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular datasets'
    });
  }
});

// @route   GET /api/datasets/search
// @desc    Search datasets
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const datasets = await Dataset.search(q)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Dataset.countDocuments({
      isActive: true,
      isPublic: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    res.json({
      success: true,
      data: datasets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search datasets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching datasets'
    });
  }
});

// @route   GET /api/datasets/:id
// @desc    Get dataset by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('approvedBy', 'fullName email');

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    if (!dataset.isActive || !dataset.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Increment view count
    await dataset.incrementViewCount();

    res.json({
      success: true,
      data: dataset
    });
  } catch (error) {
    console.error('Get dataset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dataset'
    });
  }
});

// @route   POST /api/datasets
// @desc    Create new dataset
// @access  Private
router.post('/', auth, upload.array('files', 10), validateDataset, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      state,
      year,
      source,
      sourceUrl,
      tags,
      metadata
    } = req.body;

    // Create dataset
    const dataset = new Dataset({
      title,
      description,
      category,
      subcategory,
      state,
      year: parseInt(year),
      source,
      sourceUrl,
      tags: tags ? JSON.parse(tags) : [],
      metadata: metadata ? JSON.parse(metadata) : {},
      createdBy: req.user.userId
    });

    // Add uploaded files
    if (req.files && req.files.length > 0) {
      const files = req.files.map(file => {
        const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
        const checksum = crypto.createHash('md5').update(fs.readFileSync(file.path)).digest('hex');
        
        return {
          fileName: file.filename,
          originalName: file.originalname,
          fileType: fileExtension,
          fileSize: file.size,
          filePath: file.path,
          mimeType: file.mimetype,
          checksum
        };
      });

      dataset.files = files;
      dataset.metadata.fileSize = files.reduce((total, file) => total + file.fileSize, 0);
    }

    await dataset.save();

    res.status(201).json({
      success: true,
      message: 'Dataset created successfully',
      data: dataset
    });
  } catch (error) {
    console.error('Create dataset error:', error);
    
    // Clean up uploaded files if dataset creation fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating dataset'
    });
  }
});

// @route   PUT /api/datasets/:id
// @desc    Update dataset
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Check if user is authorized to update
    if (dataset.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this dataset'
      });
    }

    const updateData = req.body;
    delete updateData.files; // Files should be updated separately

    Object.assign(dataset, updateData);
    await dataset.save();

    res.json({
      success: true,
      message: 'Dataset updated successfully',
      data: dataset
    });
  } catch (error) {
    console.error('Update dataset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating dataset'
    });
  }
});

// @route   POST /api/datasets/:id/files
// @desc    Add files to dataset
// @access  Private
router.post('/:id/files', auth, upload.array('files', 10), async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Check if user is authorized
    if (dataset.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this dataset'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Add new files
    const newFiles = req.files.map(file => {
      const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
      const checksum = crypto.createHash('md5').update(fs.readFileSync(file.path)).digest('hex');
      
      return {
        fileName: file.filename,
        originalName: file.originalname,
        fileType: fileExtension,
        fileSize: file.size,
        filePath: file.path,
        mimeType: file.mimetype,
        checksum
      };
    });

    dataset.files.push(...newFiles);
    dataset.metadata.fileSize = dataset.files.reduce((total, file) => total + file.fileSize, 0);
    await dataset.save();

    res.json({
      success: true,
      message: 'Files added successfully',
      data: {
        files: newFiles,
        totalFiles: dataset.files.length
      }
    });
  } catch (error) {
    console.error('Add files error:', error);
    
    // Clean up uploaded files if operation fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding files'
    });
  }
});

// @route   DELETE /api/datasets/:id
// @desc    Delete dataset (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Delete associated files
    if (dataset.files && dataset.files.length > 0) {
      dataset.files.forEach(file => {
        if (fs.existsSync(file.filePath)) {
          fs.unlinkSync(file.filePath);
        }
      });
    }

    await Dataset.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Dataset deleted successfully'
    });
  } catch (error) {
    console.error('Delete dataset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting dataset'
    });
  }
});

// @route   DELETE /api/datasets/:id/files/:fileId
// @desc    Remove file from dataset
// @access  Private
router.delete('/:id/files/:fileId', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Check if user is authorized
    if (dataset.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this dataset'
      });
    }

    const file = dataset.files.id(req.params.fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Remove file from dataset
    file.remove();
    dataset.metadata.fileSize = dataset.files.reduce((total, file) => total + file.fileSize, 0);
    await dataset.save();

    res.json({
      success: true,
      message: 'File removed successfully'
    });
  } catch (error) {
    console.error('Remove file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing file'
    });
  }
});

// @route   GET /api/datasets/:id/download/:fileId
// @desc    Download dataset file
// @access  Private
router.get('/:id/download/:fileId', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset || !dataset.isActive || !dataset.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    const file = dataset.files.id(req.params.fileId);
    if (!file || !file.isActive) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if file exists
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Increment download count
    await dataset.incrementDownloadCount(req.params.fileId);

    // Log download for authenticated users
    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.downloadHistory.push({
          datasetId: dataset._id,
          fileName: file.originalName,
          fileType: file.fileType
        });
        await user.save();
      }
    }

    // Send file
    res.download(file.filePath, file.originalName);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downloading file'
    });
  }
});

// @route   GET /api/datasets/:id/preview/:fileId
// @desc    Preview CSV file content
// @access  Private
router.get('/:id/preview/:fileId', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset || !dataset.isActive || !dataset.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    const file = dataset.files.id(req.params.fileId);
    if (!file || !file.isActive) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if file exists
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Only allow preview for CSV files
    if (file.fileType.toLowerCase() !== 'csv') {
      return res.status(400).json({
        success: false,
        message: 'Preview is only available for CSV files'
      });
    }

    // Get preview parameters
    const maxRows = parseInt(req.query.maxRows) || 10;
    
    // Parse CSV file for preview
    const previewData = parseCSVPreview(file.filePath, maxRows);
    
    // Get file statistics
    const fileStats = getCSVStats(file.filePath);

    res.json({
      success: true,
      data: {
        fileName: file.originalName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        preview: previewData,
        stats: fileStats
      }
    });
  } catch (error) {
    console.error('Preview file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while previewing file'
    });
  }
});

// @route   GET /api/datasets/categories/:category
// @desc    Get datasets by category
// @access  Public
router.get('/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const datasets = await Dataset.findByCategory(category)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Dataset.countDocuments({ category, isActive: true, isPublic: true });

    res.json({
      success: true,
      data: datasets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get datasets by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching datasets by category'
    });
  }
});

// @route   GET /api/datasets/states/:state
// @desc    Get datasets by state
// @access  Public
router.get('/states/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const datasets = await Dataset.findByState(state)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Dataset.countDocuments({ state, isActive: true, isPublic: true });

    res.json({
      success: true,
      data: datasets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get datasets by state error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching datasets by state'
    });
  }
});

// @route   GET /api/datasets/popular
// @desc    Get popular datasets
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const datasets = await Dataset.findPopular(parseInt(limit))
      .populate('createdBy', 'fullName email');

    res.json({
      success: true,
      data: datasets
    });
  } catch (error) {
    console.error('Get popular datasets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular datasets'
    });
  }
});



// @route   POST /api/datasets/upload
// @desc    Upload dataset file (Admin only)
// @access  Private (Admin)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const {
      title,
      description,
      category,
      state,
      year,
      source,
      sourceUrl,
      tags,
      isPublic
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Parse tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    // Create dataset
    const dataset = new Dataset({
      title,
      description,
      category,
      state,
      year: parseInt(year),
      source,
      sourceUrl,
      tags: tagArray,
      dataQuality: 'verified',
      metadata: {
        totalRecords: 0,
        fileSize: req.file.size,
        lastUpdated: new Date(),
        updateFrequency: 'yearly',
        coverage: 'state',
        timeSeries: false,
        timeRange: {
          start: parseInt(year),
          end: parseInt(year)
        }
      },
      files: [{
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileType: path.extname(req.file.originalname).toLowerCase().substring(1),
        fileSize: req.file.size,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
        isActive: true,
        downloadCount: 0
      }],
      statistics: {
        downloadCount: 0,
        viewCount: 0,
        rating: { average: 0, count: 0 },
        lastDownloaded: null
      },
      isPublic: isPublic === 'true',
      isActive: true,
      createdBy: req.user.userId
    });

    await dataset.save();

    res.status(201).json({
      success: true,
      message: 'Dataset uploaded successfully',
      data: dataset
    });
  } catch (error) {
    console.error('Upload dataset error:', error);
    
    // Clean up uploaded file if dataset creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server error while uploading dataset'
    });
  }
});

// @route   GET /api/datasets/:id/preview
// @desc    Get preview of dataset (first 10 rows)
// @access  Public
router.get('/:id/preview', async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    if (!dataset.isActive || !dataset.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Dataset not accessible'
      });
    }

    // Find the first CSV file
    const csvFile = dataset.files.find(file => file.fileType === 'csv' && file.isActive);
    
    if (!csvFile) {
      return res.status(404).json({
        success: false,
        message: 'No CSV file available for preview'
      });
    }

    // Read the CSV file and return first 10 rows
    const fs = require('fs');
    const csv = require('csv-parser');
    const path = require('path');
    
    const filePath = path.join(__dirname, '..', csvFile.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const results = [];
    const headers = [];
    let rowCount = 0;

    return new Promise((resolve, reject) => {
      const csvStream = fs.createReadStream(filePath).pipe(csv());
      
      csvStream
        .on('headers', (headerList) => {
          headers.push(...headerList);
        })
        .on('data', (data) => {
          if (rowCount < 10) {
            results.push(Object.values(data));
            rowCount++;
          } else {
            // Stop reading after 10 rows
            csvStream.destroy();
          }
        })
        .on('end', () => {
          res.json({
            success: true,
            headers: headers,
            rows: results,
            totalRows: rowCount
          });
          resolve();
        })
        .on('error', (error) => {
          res.status(500).json({
            success: false,
            message: 'Error reading file'
          });
          reject(error);
        });
    });

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/datasets/:id/bookmark
// @desc    Add dataset to user's bookmarks
// @access  Private
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    
    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    if (!dataset.isActive || !dataset.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Dataset not accessible'
      });
    }

    const user = await User.findById(req.user.userId);
    
    // Check if already bookmarked
    const existingBookmark = user.bookmarks.find(bookmark => 
      bookmark.datasetId.toString() === req.params.id
    );

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Dataset already bookmarked'
      });
    }

    // Add to bookmarks
    user.bookmarks.push({
      datasetId: dataset._id,
      title: dataset.title,
      category: dataset.category,
      state: dataset.state,
      year: dataset.year,
      bookmarkedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Dataset bookmarked successfully'
    });

  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/datasets/:id/bookmark
// @desc    Remove dataset from user's bookmarks
// @access  Private
router.delete('/:id/bookmark', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Remove from bookmarks
    user.bookmarks = user.bookmarks.filter(bookmark => 
      bookmark.datasetId.toString() !== req.params.id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Bookmark removed successfully'
    });

  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 