const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - User data and token
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    const userData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      language: user.language,
      accountType: user.accountType,
      betaFeatures: user.betaFeatures,
      keyboardShortcuts: user.keyboardShortcuts
    };
    
    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Register user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - User data and token
 */
const registerUser = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = await User.create({ username, fullName, email, password });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - User data
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Success message
 */
const logoutUser = async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
  logoutUser,
};