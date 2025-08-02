const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const datasetRoutes = require('./routes/datasets');

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// API routes
const apiPrefix = process.env.API_PREFIX || '/api';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/datasets`, datasetRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'StatsOfIndia API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

// API info endpoint
app.get(`${apiPrefix}`, (req, res) => {
  res.json({
    success: true,
    message: 'StatsOfIndia API',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      auth: `${apiPrefix}/auth`,
      datasets: `${apiPrefix}/datasets`
    },
    documentation: `${req.protocol}://${req.get('host')}${apiPrefix}/docs`
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stats-of-india';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API available at: http://localhost:${PORT}${apiPrefix}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
};

startServer(); 