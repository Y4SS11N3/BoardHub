const Board = require('../models/Board');

/**
 * Create a new board
 * @param {string} subject 
 * @param {string} content 
 * @param {string} image 
 * @param {number} userId 
 * @returns {Promise<Board>}
 */
const createBoard = async (subject, content, image, userId) => {
  return await Board.create({ subject, content, image, userId });
};

/**
 * Get all boards for a user
 * @param {number} userId 
 * @returns {Promise<Board[]>}
 */
const getBoards = async (userId) => {
  return await Board.findAll({ where: { userId } });
};

module.exports = {
  createBoard,
  getBoards,
};