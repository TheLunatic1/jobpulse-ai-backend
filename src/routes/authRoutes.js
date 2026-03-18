const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Test route (still there)
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes working!' });
});

// Register
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;