const folderService = require('../services/folderService');
const Folder = require('../models/Folder');
const Board = require('../models/Board');

/**
 * Create a new folder
 */
const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await folderService.createFolder(name, req.user.id);
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all folders for a user
 */
const getUserFolders = async (req, res) => {
  try {
    const folders = await folderService.getUserFolders(req.user.id);
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update a folder
 */
const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedFolder = await folderService.updateFolder(id, name, req.user.id);
    res.json(updatedFolder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all boards in a folder
 */
const getFolderBoards = async (req, res) => {
  try {
    const { id } = req.params;
    const boards = await folderService.getFolderBoards(id, req.user.id);
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Rename a folder
 */
const renameFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const folder = await Folder.findOne({ where: { id, userId } });
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found or you do not have permission to rename it' });
    }
    
    folder.name = name;
    await folder.save();
    
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error renaming folder', error: error.message });
  }
};

/**
 * Delete a folder
 */
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const folder = await Folder.findByPk(id);
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    
    await Board.update({ folderId: null }, { where: { folderId: id } });
    
    await folder.destroy();
    
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting folder', error: error.message });
  }
};

module.exports = {
  createFolder,
  getUserFolders,
  updateFolder,
  getFolderBoards,
  renameFolder,
  deleteFolder
};