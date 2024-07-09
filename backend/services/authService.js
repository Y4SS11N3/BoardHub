const User = require('../models/User');

/**
 * Authenticate a user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<User>}
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  return user;
};

/**
 * Register a new user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<User>}
 */
const registerUser = async (email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }
  return await User.create({ email, password });
};

module.exports = {
  loginUser,
  registerUser,
};