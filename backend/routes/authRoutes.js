const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// IMPORTANT: NO MIDDLEWARE on these routes - they are PUBLIC
router.post('/register', register);  // Just the controller function, no protect middleware!
router.post('/login', login);        // Just the controller function, no protect middleware!

// Debug route to check if router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

module.exports = router;