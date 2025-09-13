const { validationResult } = require('express-validator');

// Validation middleware
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Report validation rules
exports.reportRules = [
  // Add validation rules as needed
];

// User validation rules
exports.userRules = [
  // Add validation rules as needed
];
