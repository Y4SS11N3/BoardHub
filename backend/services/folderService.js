const Folder = require('../models/Folder');
const Board = require('../models/Board');

/**
 * Create a new folder
 * @param {string} name 
 * @param {number} userId 
 * @returns {Promise<Folder>}
 */
const createFolder = async (name, userId) => {
  return await Folder.create({ name, userId });
};

/**
 * Get all folders for a user
 * @param {number} userId 
 * @returns {Promise<Folder[]>}
 */
const getUserFolders = async (userId) => {
  return await Folder.findAll({ where: { userId } });
};

/**
 * Update a folder
 * @param {string} id 
 * @param {string} name 
 * @param {number} userId 
 * @returns {Promise<Folder>}
 */
const updateFolder = async (id, name, userId) => {
  const folder = await Folder.findOne({ where: { id, userId } });
  if (!folder) {
    throw new Error('Folder not found');
  }
  folder.name = name;
  return await folder.save();
};

/**
 * Delete a folder
 * @param {string} id 
 * @param {number} userId 
 */
const deleteFolder = async (id, userId) => {
  const folder = await Folder.findOne({ where: { id, userId } });
  if (!folder) {
    throw new Error('Folder not found');
  }
  await folder.destroy();
};

/**
 * Get all boards in a folder
 * @param {string} folderId 
 * @param {number} userId 
 * @returns {Promise<Board[]>}
 */
const getFolderBoards = async (folderId, userId) => {
  const folder = await Folder.findOne({
    where: { id: folderId, userId },
    include: [{ model: Board, as: 'boards' }]
  });
  if (!folder) {
    throw new Error('Folder not found');
  }
  return folder.boards;
};

module.exports = {
  createFolder,
  getUserFolders,
  updateFolder,
  deleteFolder,
  getFolderBoards,
};