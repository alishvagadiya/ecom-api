const NodeCache = require('node-cache');

// Create a cache instance
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache expires in 5 minutes (adjust as needed)

// Middleware to check cache before processing a request
exports.checkCache = (req, res, next) => {
  const key = req.originalUrl || req.url;
  const cachedData = cache.get(key);

  if (cachedData) {
    return res.json(cachedData);
  }

  next();
};
