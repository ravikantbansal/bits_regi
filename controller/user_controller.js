const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user'); // Adjust path as needed
const BlacklistedToken = require('../model/BlackListedToken'); 

// Register a new user
exports.register = async (req, res) => {
    try {
      const { username, email, role, password } = req.body;
      console.log(req.body);
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = new User({
        username,
        email,
        role,
        password: hashedPassword,
      });
  
      // Save user to database
      const savedUser = await newUser.save();
      console.log(savedUser);
  
      // Create a JWT token
      const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, 'your_jwt_secret', { expiresIn: '1h' });
  
      // Respond with success message and token
      res.status(201).json({
        message: 'User registered successfully',
        user: savedUser,
        token: token,  // Send the token
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send both token and user data (or just user ID if needed)
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // `req.user` is populated by the JWT middleware

        // Fetch user data (excluding password)
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users (excluding password field)
        const users = await User.find().select('-password');
        
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

 // Import the BlacklistedToken model

// Logout user (invalidate the JWT token)
exports.logout = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.header('Authorization')?.split(' ')[1];  // Token comes in 'Bearer <token>' format

        if (!token) {
            return res.status(401).json({ message: 'No token provided to log out.' });
        }

        // Blacklist the token by saving it to the database
        const blacklistToken = new BlacklistedToken({
            token,
            expiresAt: new Date(Date.now() + 3600000) // Set an expiration time for the blacklisted token (1 hour)
        });

        // Save the blacklisted token to the database
        await blacklistToken.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};