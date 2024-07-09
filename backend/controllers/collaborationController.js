const Collaboration = require('../models/Collaboration');
const Board = require('../models/Board');
const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * Add a collaborator to a board
 */
const addCollaborator = async (req, res) => {
  try {
    const { boardId, emailOrUsername, role } = req.body;

    if (!boardId || !emailOrUsername) {
      return res.status(400).json({ message: 'Board ID and email or username are required' });
    }

    const board = await Board.findOne({ where: { boardId: boardId } });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [collaboration, created] = await Collaboration.findOrCreate({
      where: { boardId: board.id, userId: user.id },
      defaults: { role }
    });

    if (!created) {
      collaboration.role = role;
      await collaboration.save();
    }

    res.status(201).json(collaboration);
  } catch (error) {
    res.status(500).json({ message: 'Error adding collaborator', error: error.message });
  }
};

/**
 * Remove a collaborator from a board
 */
const removeCollaborator = async (req, res) => {
  try {
    const { boardId, userId } = req.params;
    const collaboration = await Collaboration.findOne({ where: { boardId, userId } });

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    await collaboration.destroy();
    res.status(200).json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing collaborator', error: error.message });
  }
};

/**
 * Update a collaborator's role
 */
const updateCollaboratorRole = async (req, res) => {
  try {
    const { boardId, userId } = req.params;
    const { role } = req.body;
    const collaboration = await Collaboration.findOne({ where: { boardId, userId } });

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration not found' });
    }

    collaboration.role = role;
    await collaboration.save();

    res.status(200).json(collaboration);
  } catch (error) {
    res.status(500).json({ message: 'Error updating collaborator role', error: error.message });
  }
};

/**
 * Get all collaborators for a board
 */
const getCollaborators = async (req, res) => {
  try {
    const { boardId } = req.params;
    const collaborations = await Collaboration.findAll({
      where: { boardId },
      include: [{ model: User, attributes: ['id', 'username', 'email', 'fullName'] }]
    });

    res.status(200).json(collaborations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collaborators', error: error.message });
  }
};

/**
 * Get all collaborations for a user
 */
const getUserCollaborations = async (req, res) => {
  try {
    const userId = req.user.id;
    const collaborations = await Collaboration.findAll({
      where: { userId },
      include: [{ model: Board, attributes: ['id', 'title', 'lastViewed'] }]
    });

    res.status(200).json(collaborations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user collaborations', error: error.message });
  }
};

module.exports = {
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  getCollaborators,
  getUserCollaborations
};