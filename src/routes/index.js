// customerRoutes.js

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const paramValue = req.query.param;
  if (paramValue) {
    res.send(`The value of 'param' is: ${paramValue}`);
  } else {
    res.status(400).send('Parameter "param" is missing.');
  }
});

module.exports = router;
