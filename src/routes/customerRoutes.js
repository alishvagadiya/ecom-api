// /src/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { verifyToken } = require('../Middleware/authMiddleware');
const customerController = require('../controllers/customerController');
const { checkCache, setCache } = require('../utils/cache');

// Middleware to validate incoming data
const validateData = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email address'),
  check('address').notEmpty().withMessage('Address is required'),
];

// Middleware to check for validation errors
checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
router.post('/', verifyToken, validateData, checkValidationResult, customerController.addCustomer);
router.get('/', verifyToken, checkCache, customerController.getAllCustomer);
router.get('/:id', verifyToken, checkCache, customerController.getCustomer);
router.put('/:id', verifyToken, validateData, checkValidationResult, customerController.updateCustomer);
router.delete('/:id', verifyToken, customerController.deleteCustomer);

module.exports = router;
