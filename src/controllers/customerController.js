// /src/controllers/customerController.js
const Customer = require('../models/customerModel');

exports.addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.json(customer);
  } catch (error) {
    console.log({ error })
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    if (customers) {
      res.json(customers);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.update(req.body);
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.destroy();
      res.json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
