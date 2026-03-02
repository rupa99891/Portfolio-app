// ============================================================
// middleware/authMiddleware.js
// Protects routes by verifying the JWT token
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT tokens are sent in the Authorization header as: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      // This will throw an error if the token is invalid or expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID stored in the token
      // .select('-password') excludes the password field from the result
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
