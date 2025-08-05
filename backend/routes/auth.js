const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user and send OTP
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { fullName, email, phone, organization, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    // Send OTP email first
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    // TEMPORARY: Log OTP for testing (remove in production)
    console.log(`🔢 OTP for ${email}: ${otp}`);
    console.log(`📧 Email sent: ${emailResult.messageId}`);

    // Create temporary user data (not saved to database yet)
    const tempUserData = {
      fullName,
      email,
      phone,
      organization,
      password,
      isEmailVerified: false,
      emailVerificationOTP: {
        code: otp,
        expiresAt: otpExpiresAt
      }
    };

    // Store temporary data in session or return it to frontend
    res.status(200).json({
      success: true,
      message: 'Verification code sent! Please check your email and verify your account.',
      data: {
        tempUserData,
        email: email,
        requiresVerification: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/verify-and-register
// @desc    Verify OTP and create user account
// @access  Public
router.post('/verify-and-register', async (req, res) => {
  try {
    const { fullName, email, phone, organization, password, otp } = req.body;

    if (!fullName || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: 'All required fields are needed'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user with verified email
    const user = new User({
      fullName,
      email,
      phone,
      organization,
      password,
      isEmailVerified: true,
      emailVerificationOTP: {
        code: null,
        expiresAt: null
      }
    });

    await user.save();

    // Send welcome email
    await sendWelcomeEmail(email, fullName);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'stats-of-india-super-secret-jwt-key-2024',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to StatsOfIndia.',
      data: {
        user: user.profile,
        token
      }
    });
  } catch (error) {
    console.error('Verification and registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account creation'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID and OTP are required'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check if OTP exists and is valid
    if (!user.emailVerificationOTP.code || !user.emailVerificationOTP.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please register again.'
      });
    }

    // Check if OTP is expired
    if (new Date() > user.emailVerificationOTP.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please register again.'
      });
    }

    // Check if OTP matches
    if (user.emailVerificationOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationOTP = {
      code: null,
      expiresAt: null
    };
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'stats-of-india-super-secret-jwt-key-2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to StatsOfIndia.',
      data: {
        user: user.profile,
        token
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP for email verification
// @access  Public
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update OTP
    user.emailVerificationOTP = {
      code: otp,
      expiresAt: otpExpiresAt
    };
    await user.save();

    // Send new OTP email
    const emailResult = await sendOTPEmail(user.email, otp);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'New verification code sent to your email'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending OTP'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }



    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'stats-of-india-super-secret-jwt-key-2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.profile,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
              data: {
          user: user.profile,
          preferences: user.preferences,
          downloadHistory: user.downloadHistory.slice(-10), // Last 10 downloads
          searchHistory: user.searchHistory.slice(-10), // Last 10 searches
          bookmarks: user.bookmarks // All bookmarks
        }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/search-history
// @desc    Save search to user's search history
// @access  Private
router.post('/search-history', auth, async (req, res) => {
  try {
    const { query, timestamp } = req.body;
    
    if (!query || !timestamp) {
      return res.status(400).json({
        success: false,
        message: 'Query and timestamp are required'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add to search history (keep only last 50 searches)
    user.searchHistory.push({
      query,
      searchedAt: new Date(timestamp)
    });

    // Keep only the last 50 searches
    if (user.searchHistory.length > 50) {
      user.searchHistory = user.searchHistory.slice(-50);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Search history saved'
    });

  } catch (error) {
    console.error('Save search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const { dataCategories } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    user.preferences = {
      notifications: {
        email: user.preferences?.notifications?.email ?? true,
        push: user.preferences?.notifications?.push ?? false
      },
      dataCategories: dataCategories || []
    };

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, phone, organization } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile fields
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (organization !== undefined) user.organization = organization;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.profile
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 