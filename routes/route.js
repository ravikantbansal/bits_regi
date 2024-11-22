const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers, logout } = require('../controller/user_controller'); // Adjust path as needed
const authenticateJWT = require('../auth'); // Import the JWT authentication middleware

// Route to register a new user
router.post('/register', register);

// Route to log in an existing user and get a JWT token
router.post('/login', login);

router.post('/logout', logout);

// Route to get the logged-in user's profile (protected route)
router.get('/profile', authenticateJWT, getProfile);

router.get('/allUsers', authenticateJWT, getAllUsers);


getAllUsers

module.exports = router;
