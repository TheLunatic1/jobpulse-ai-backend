const express = require('express');
const router = express.Router();

// Test endpoint (to confirm deployment works)
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth routes are live!',
    serverTime: new Date().toISOString()
  });
});

// We'll add register & login here later
// router.post('/register', ...)
// router.post('/login', ...)

module.exports = router;