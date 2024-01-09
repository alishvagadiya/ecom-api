// /src/routes/orderRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../Middleware/authMiddleware');
const { checkCache, setCache } = require('../utils/cache');
// Validation middleware for creating an order
validateOrderCreation = [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('products').isArray().withMessage('Products should be an array')
];

// Middleware to check for validation errors
checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', verifyToken, validateOrderCreation, checkValidationResult, orderController.placeOrder);
router.get('/:id', verifyToken, checkCache, orderController.getOrder);
router.put('/:id', verifyToken, validateOrderCreation, checkValidationResult, orderController.updateOrder);
router.delete('/:id', verifyToken, orderController.cancelOrder);

module.exports = router;
