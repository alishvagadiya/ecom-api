// /src/utils/db.js
const Sequelize = require('sequelize');

const connection = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'rootadmin',
  database: 'ecom-astute',
});

module.exports = connection;
