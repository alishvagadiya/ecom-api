// /src/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const customerController = require('../controllers/customerController');
// const checkCache = require('../utils/cache');

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
router.post('/', validateData, checkValidationResult, customerController.addCustomer);
router.get('/', customerController.getAllCustomer);
router.get('/:id', customerController.getCustomer);
router.put('/:id', validateData, checkValidationResult, customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
