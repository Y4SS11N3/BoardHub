const User = require('../models/User');

class UserService {
  /**
   * Get a user by ID
   * @param {number} userId 
   * @returns {Promise<User>}
   */
  static async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update a user
   * @param {number} userId 
   * @param {Object} userData 
   * @returns {Promise<User>}
   */
  static async updateUser(userId, userData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return await user.update(userData);
  }

  /**
   * Delete a user
   * @param {number} userId 
   */
  static async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.destroy();
  }

  /**
   * Update a user's password
   * @param {number} userId 
   * @param {string} currentPassword 
   * @param {string} newPassword 
   */
  static async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
  
    user.password = newPassword;
    await user.save();
  }
}

module.exports = UserService;