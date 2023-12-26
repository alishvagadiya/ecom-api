// /src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const db = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes); // Add this line
db.sync();


const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// });

module.exports = server