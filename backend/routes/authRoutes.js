const express = require('express');
const router = express.Router();
const { register, login, validateToken, getCurrentUser } = require('../src/controllers/authController');
const { protect } = require('../src/middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/validate', protect, validateToken);
router.get('/me', protect, getCurrentUser);

module.exports = router;