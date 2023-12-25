// /src/models/orderModel.js
const Sequelize = require('sequelize');
const db = require('../utils/db');
const Product = require('./productModel'); // Import the Product model
const Customer = require('./customerModel'); // Import the Customer model

const Order = db.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  orderStatus: {
    type: Sequelize.STRING, // Change the data type if needed
    allowNull: false,
    defaultValue: 'pending', // Set a default value if needed
  },
});

// Define many-to-one association between Order and Customer
Order.belongsTo(Customer, { foreignKey: 'customerId' });

// Define many-to-many association between Order and Product
Order.belongsToMany(Product, { through: 'orderProducts', foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: 'orderProducts', foreignKey: 'productId' });

module.exports = Order;
