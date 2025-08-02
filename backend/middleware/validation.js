const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
const validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  validate
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

// Dataset validation
const validateDataset = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('category')
    .isIn(['demographics', 'education', 'economy', 'health', 'agriculture'])
    .withMessage('Invalid category'),
  
  body('state')
    .isIn([
      'all-india', 'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 
      'chhattisgarh', 'goa', 'gujarat', 'haryana', 'himachal-pradesh', 
      'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 
      'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 
      'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura', 
      'uttar-pradesh', 'uttarakhand', 'west-bengal', 'delhi', 'chandigarh',
      'dadra-and-nagar-haveli', 'daman-and-diu', 'lakshadweep', 'puducherry',
      'andaman-and-nicobar-islands', 'jammu-and-kashmir', 'ladakh'
    ])
    .withMessage('Invalid state'),
  
  body('year')
    .isInt({ min: 1900, max: 2030 })
    .withMessage('Year must be between 1900 and 2030'),
  
  body('source')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Source must be between 2 and 200 characters'),
  
  body('sourceUrl')
    .optional()
    .isURL()
    .withMessage('Please enter a valid URL'),
  
  validate
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateDataset
}; 