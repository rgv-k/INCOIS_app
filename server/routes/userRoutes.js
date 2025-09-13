const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// POST /api/users/register - Register a user
router.post('/register', userController.register);

// POST /api/users/login - Login a user
router.post('/login', userController.login);

// GET /api/users/profile - Get user profile (auth required)
router.get('/profile', auth, userController.getProfile);

module.exports = router;
