const Collaboration = require('../models/Collaboration');

/**
 * Create a new collaboration
 * @param {string} boardId 
 * @param {number} userId 
 * @param {number} createdById 
 * @returns {Promise<Collaboration>}
 */
const createCollaboration = async (boardId, userId, createdById) => {
  return await Collaboration.create({ boardId, userId, createdById });
};

/**
 * Get all collaborations for a board
 * @param {string} boardId 
 * @returns {Promise<Collaboration[]>}
 */
const getCollaborations = async (boardId) => {
  return await Collaboration.findAll({ where: { boardId } });
};

module.exports = {
  createCollaboration,
  getCollaborations,
};