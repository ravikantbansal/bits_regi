const jwt = require('jsonwebtoken');
const BlacklistedToken = require('./model/BlackListedToken');  // Import the BlacklistedToken model

// Middleware to verify the JWT token
const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Check if the token is blacklisted
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        if (blacklistedToken) {
            return res.status(403).json({ message: 'Token has been invalidated. Please log in again.' });
        }

        // Verify the token with the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  // Attach the decoded user info to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateJWT;

