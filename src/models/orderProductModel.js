// /src/models/orderProductModel.js
const Sequelize = require('sequelize');
const db = require('../utils/db');

const OrderProduct = db.define('orderProducts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

module.exports = OrderProduct;
