const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Add this import

exports.validateSignup = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.validateForgotPassword = [
  body('email').isEmail().withMessage('Invalid email address'),
];

exports.validateChangePassword = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log({ token })
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token.replace('Bearer ', ''), 'your-secret-key', (err, decoded) => {
    // console.log({ token, err, decoded })
    if (err) {
      return res.status(401).json({ error: 'Invalid token', err, decoded });
    }

    req.customerId = decoded.customerId;
    next();
  });
};

exports.verifyResetToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your-reset-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.body.customerId = decoded.customerId;
    next();
  });
};