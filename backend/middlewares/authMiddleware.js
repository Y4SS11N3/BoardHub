const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authenticate user based on JWT token
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      throw new Error('Authorization header missing');
    }
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.token === null) {
      throw new Error('Token has been invalidated');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;