// customerRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin, validateForgotPassword, validateChangePassword, checkValidationResult, verifyToken } = require('../Middleware/authMiddleware');

// Signup Route
router.post('/signup', validateSignup, checkValidationResult, authController.signup);

// Login Route
router.post('/login', validateLogin, checkValidationResult, authController.login);

// Forgot Password Route
router.post('/forgot-password', validateForgotPassword, checkValidationResult, authController.forgotPassword);

router.put('/change-password', verifyToken, validateChangePassword, checkValidationResult, authController.changePassword);

router.put('/reset-password', authController.resetPassword);

module.exports = router;
