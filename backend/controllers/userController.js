const UserService = require('../services/userService');
const { validationResult } = require('express-validator');
const { User } = require('../models/associations');
const { Op } = require('sequelize');
const Board = require('../models/Board');

/**
 * Get user profile
 */
const getUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedUser = await UserService.updateUser(req.user.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 */
const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 */
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await UserService.updatePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Search for users
 */
const searchUsers = async (req, res, next) => {
  try {
    const { term } = req.query;

    if (!term || term.length < 2) {
      return res.status(400).json({ message: 'Search term must be at least 2 characters long' });
    }

    const users = await User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { username: { [Op.like]: `%${term}%` } },
              { email: { [Op.like]: `%${term}%` } },
              { fullName: { [Op.like]: `%${term}%` } }
            ]
          },
          {
            id: { [Op.ne]: req.user.id }
          }
        ]
      },
      attributes: ['id', 'username', 'email', 'fullName', 'avatarUrl'],
      limit: 10
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found matching the search criteria' });
    }

    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile by username
 */
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'fullName', 'about', 'avatarUrl', 'followers', 'following'],
      include: [
        {
          model: Board,
          as: 'boards',
          where: { isPublic: true },
          attributes: ['id', 'boardId', 'title', 'background', 'updatedAt'],
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get user's boards
 */
const getUserBoards = async (req, res) => {
  try {
    const boards = await Board.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']]
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Follow a user
 */
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findByPk(req.user.id);
    const userToFollow = await User.findByPk(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    if (currentUser.id === userToFollow.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    if (!currentUser.following) {
      currentUser.following = [];
    }

    if (!currentUser.following.includes(userToFollow.id)) {
      await currentUser.update({
        following: [...currentUser.following, userToFollow.id]
      });

      if (!userToFollow.followers) {
        userToFollow.followers = [];
      }

      await userToFollow.update({
        followers: [...userToFollow.followers, currentUser.id]
      });

      res.json({ message: 'User followed successfully' });
    } else {
      res.status(400).json({ message: 'You are already following this user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Unfollow a user
 */
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findByPk(req.user.id);
    const userToUnfollow = await User.findByPk(userId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(userToUnfollow.id)) {
      await currentUser.update({
        following: currentUser.following.filter(id => id !== userToUnfollow.id)
      });

      await userToUnfollow.update({
        followers: userToUnfollow.followers.filter(id => id !== currentUser.id)
      });

      res.json({ message: 'User unfollowed successfully' });
    } else {
      res.status(400).json({ message: 'You are not following this user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get user's public boards
 */
const getUserPublicBoards = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const publicBoards = await Board.findAll({
      where: { userId: user.id, isPublic: true },
      order: [['updatedAt', 'DESC']]
    });

    res.json(publicBoards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  searchUsers,
  getUserProfile,
  getUserBoards,
  followUser,
  unfollowUser,
  getUserPublicBoards
};