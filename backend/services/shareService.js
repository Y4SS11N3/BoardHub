const { v4: uuidv4 } = require('uuid');
const Board = require('../models/Board');

/**
 * Generate a share token for a board
 * @param {string} boardId 
 * @returns {Promise<string>}
 */
const generateShareToken = async (boardId) => {
  const board = await Board.findOne({ where: { boardId } });
  if (!board) {
    throw new Error('Board not found');
  }

  const shareToken = uuidv4();
  board.shareToken = shareToken;
  board.isPublic = true;
  await board.save();

  return shareToken;
};

/**
 * Revoke a share token for a board
 * @param {string} boardId 
 */
const revokeShareToken = async (boardId) => {
  const board = await Board.findOne({ where: { boardId } });
  if (!board) {
    throw new Error('Board not found');
  }

  board.shareToken = null;
  board.isPublic = false;
  await board.save();
};

module.exports = {
  generateShareToken,
  revokeShareToken,
};