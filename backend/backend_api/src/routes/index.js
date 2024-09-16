// src/routes/index.js

const express = require('express');


// Create a router instance for mounting the API
const router = express.Router();


// Simple GET - health check route
router.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Success! Server is running.'
    });
  });

// Link routes to route handlers
router.post('/sensor-data', require('./post'));
router.get('/sensor-data', require('./get'));

// Export the router
module.exports = router;