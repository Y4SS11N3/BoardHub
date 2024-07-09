const Card = require('../models/Card');

/**
 * Create a new card
 * @param {string} title 
 * @param {string} description 
 * @param {string} boardId 
 * @param {number} userId 
 * @returns {Promise<Card>}
 */
const createCard = async (title, description, boardId, userId) => {
  return await Card.create({ title, description, boardId, userId });
};

/**
 * Get all cards for a board
 * @param {string} boardId 
 * @returns {Promise<Card[]>}
 */
const getCards = async (boardId) => {
  return await Card.findAll({ where: { boardId } });
};

module.exports = {
  createCard,
  getCards,
};