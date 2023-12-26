const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel');
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Create a new customer
    const newCustomer = await Customer.create({ name, email, password });

    // You may want to generate and send a verification email here

    // Generate JWT token
    const token = jwt.sign({ customerId: newCustomer.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(201).json({ message: 'Signup successful', customer: newCustomer, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the customer exists
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    if (password !== customer.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ customerId: customer.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', customer, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the customer exists
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Generate and send a reset password link or token via email
    // we can use a service like Nodemailer to send emails

    // Generate a temporary reset token
    const resetToken = jwt.sign({ customerId: customer.id }, 'your-reset-secret-key', { expiresIn: '1h' });

    // Hash a default temporary password
    const hashedPassword = await bcrypt.hash('tempPassword123', 10);

    // Update customer's password with the hashed default password
    customer.password = hashedPassword;
    await customer.save();

    res.status(200).json({ message: 'Temporary password set successfully', password: tempPassword123, resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const customer = await Customer.findOne({ where: { email, password: currentPassword } });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update password
    customer.password = newPassword;
    await customer.save();

    // Generate JWT token
    const token = jwt.sign({ customerId: customer.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Password changed successfully', customer, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { customerId, newPassword } = req.body;

    // Find the customer based on the decoded ID
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the customer's password with the new hashed password
    customer.password = hashedPassword;
    await customer.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid reset token' });
  }
};
