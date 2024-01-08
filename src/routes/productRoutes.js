// /src/routes/productRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../Middleware/authMiddleware');

// Validation middleware for creating a product
validateProductCreation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Price should be a numeric value'),
];

// Middleware to check for validation errors
checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', verifyToken, validateProductCreation, checkValidationResult, productController.addProduct);
router.get('/', verifyToken, checkCache, productController.getAllProduct);
router.get('/:id', verifyToken, checkCache, productController.getProduct);
router.put('/:id', verifyToken, validateProductCreation, checkValidationResult, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
