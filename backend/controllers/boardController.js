const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const path = require('path');
const Board = require('../models/Board');
const Card = require('../models/Card');
const { User } = require('../models/associations');
const Collaboration = require('../models/Collaboration');
const Folder = require('../models/Folder');
const { extractDominantColor } = require('../utils/colorExtractor');

/**
 * Create a new board
 */
const createBoard = async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    const userId = req.user.id;

    const backgrounds = ['b1.jpg', 'b2.jpg', 'b3.jpg', 'b4.jpg', 'b5.jpg', 'b6.jpg', 'b7.jpg'];
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const dominantColor = await extractDominantColor(randomBackground);

    const newBoard = await Board.create({ 
      boardId: uuidv4().slice(0, 13),
      title: title || 'Untitled Board', 
      subject,
      content,
      userId,
      background: randomBackground,
      dominantColor
    });

    res.status(201).json(newBoard);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while creating the board' });
    }
  }
};

/**
 * Get a board by id
 */
const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findOne({
      where: { boardId: id },
      include: [{
        model: Card,
        as: 'cards',
        order: [['position', 'ASC']]
      }]
    });

    if (!board) {
      return res.status(404).json({ error: `Board with boardId ${id} not found` });
    }

    board.lastViewed = new Date();
    await board.save();

    let organizedBoard = board.toJSON();

    if (!organizedBoard.dominantColor) {
      organizedBoard.dominantColor = await extractDominantColor(organizedBoard.background);
      if (organizedBoard.dominantColor) {
        await Board.update({ dominantColor: organizedBoard.dominantColor }, { where: { id: board.id } });
      }
    }

    res.json(organizedBoard);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the board' });
  }
};

/**
 * Update a board
 */
const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const board = await Board.findOne({ where: { boardId: id } });

    if (!board) {
      return res.status(404).json({ error: `Board with boardId ${id} not found` });
    }

    if (board.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to update this board' });
    }

    const allowedFields = ['title', 'subject', 'content', 'isPublic', 'background', 'dominantColor', 'format'];
    const updatedFields = {};

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updatedFields[field] = updateData[field];
      }
    });

    await board.update(updatedFields);

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the board' });
  }
};

/**
 * Delete a board
 */
const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findOne({ 
      where: { 
        [Op.or]: [
          { id: id },
          { boardId: id }
        ],
        userId: req.user.id 
      } 
    });

    if (!board) {
      return res.status(404).json({ error: `Board with ID ${id} not found` });
    }

    await board.destroy();

    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the board' });
  }
};

/**
 * Get all boards for a user
 */
const getUserBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    const boards = await Board.findAll({
      where: { userId },
      order: [['lastViewed', 'DESC']]
    });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user boards' });
  }
};

/**
 * Toggle sections for a board
 */
const toggleSections = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;
    
    const board = await Board.findOne({
      where: { boardId: id },
      include: [{
        model: Card,
        as: 'cards',
        order: [['position', 'ASC']]
      }]
    });

    if (!board) {
      return res.status(404).json({ error: `Board with boardId ${id} not found` });
    }

    board.sectionsEnabled = enabled;

    if (enabled && (!board.sections || board.sections.length === 0)) {
      const defaultSection = { id: uuidv4(), title: 'Section 1', cards: [] };
      board.sections = [defaultSection];
    }

    if (!board.sections) {
      board.sections = [];
    }

    const organizedSections = board.sections.map(section => ({
      ...section,
      cards: board.cards.filter(card => card.sectionId === section.id)
        .sort((a, b) => a.position - b.position)
    }));

    const unsectionedCards = board.cards.filter(card => !card.sectionId);
    if (unsectionedCards.length > 0) {
      if (organizedSections.length === 0) {
        organizedSections.push({
          id: uuidv4(),
          title: 'Unsectioned Cards',
          cards: unsectionedCards
        });
      } else {
        organizedSections[0].cards = [...organizedSections[0].cards, ...unsectionedCards];
      }
    }

    board.sections = organizedSections;
    await board.save();

    const responseData = {
      ...board.toJSON(),
      sectionsEnabled: enabled,
      sections: organizedSections,
      allCards: board.cards
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while toggling sections', details: error.message });
  }
};

/**
 * Add a section to a board
 */
const addSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const board = await Board.findOne({ where: { boardId: id } });
    if (!board) {
      return res.status(404).json({ error: `Board with boardId ${id} not found` });
    }
    const newSection = {
      id: uuidv4(),
      title: title || `Section ${board.sections.length + 1}`,
      cards: []
    };
    board.sections = [...board.sections, newSection];
    await board.save();
    res.json(newSection);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding a section' });
  }
};

/**
 * Reorder cards in a board
 */
const reorderCards = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardIds } = req.body;

    const board = await Board.findOne({ where: { boardId: id } });
    if (!board) {
      return res.status(404).json({ error: `Board with boardId ${id} not found` });
    }

    const allCards = await Card.findAll({ where: { boardId: id } });
    const pinnedCards = allCards.filter(card => card.isPinned);
    const unpinnedCards = allCards.filter(card => !card.isPinned);

    await Promise.all(pinnedCards.map((card, index) => 
      Card.update({ position: index }, { where: { id: card.id } })
    ));

    const newUnpinnedOrder = cardIds.filter(cardId => 
      unpinnedCards.some(card => card.id === cardId)
    );

    await Promise.all(newUnpinnedOrder.map((cardId, index) => 
      Card.update(
        { position: pinnedCards.length + index },
        { where: { id: cardId, boardId: id } }
      )
    ));

    const updatedCards = await Card.findAll({
      where: { boardId: id },
      order: [['isPinned', 'DESC'], ['position', 'ASC']]
    });

    res.json(updatedCards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while reordering cards', details: error.message });
  }
};

/**
 * Update sections of a board
 */
const updateSections = async (req, res) => {
  try {
    const { id } = req.params;
    const { sections } = req.body;

    const board = await Board.findOne({ where: { boardId: id } });
    if (!board) {
      return res.status(404).json({ error: `Board with boardId ${id} not found` });
    }

    await sequelize.transaction(async (t) => {
      board.sections = sections;
      await board.save({ transaction: t });

      const updatePromises = sections.flatMap((section, sectionIndex) =>
        section.cards.map((card, cardIndex) =>
          Card.update(
            { 
              sectionId: section.id, 
              position: cardIndex,
              boardId: id
            },
            { 
              where: { id: card.id },
              transaction: t
            }
          )
        )
      );

      await Promise.all(updatePromises);
    });

    const updatedBoard = await Board.findOne({
      where: { boardId: id },
      include: [{
        model: Card,
        as: 'cards',
        order: [['position', 'ASC']]
      }]
    });

    const organizedSections = updatedBoard.sections.map(section => ({
      ...section,
      cards: updatedBoard.cards.filter(card => card.sectionId === section.id)
        .sort((a, b) => a.position - b.position)
    }));

    updatedBoard.sections = organizedSections;

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating sections' });
  }
};

/**
 * Update last viewed timestamp of a board
 */
const updateLastViewed = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findOne({ where: { boardId: id } });

    if (!board) {
      return res.status(404).json({ error: `Board with boardId ${id} not found` });
    }

    board.lastViewed = new Date();
    await board.save();

    res.status(200).json({ message: 'Last viewed updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating last viewed' });
  }
};

/**
 * Move a board to trash
 */
const moveToTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({ 
      where: { 
        [Op.or]: [
          { id: id },
          { boardId: id }
        ],
        userId: userId 
      } 
    });

    if (!board) {
      return res.status(404).json({ error: `Board with ID ${id} not found` });
    }

    board.trashed = true;
    await board.save();

    res.json({ message: 'Board moved to trash successfully', board });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while moving the board to trash' });
  }
};

/**
 * Get all trashed boards for a user
 */
const getTrashedBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    const trashedBoards = await Board.findAll({ 
      where: { userId, trashed: true },
      order: [['updatedAt', 'DESC']]
    });
    res.json(trashedBoards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching trashed boards' });
  }
};

/**
 * Restore a board from trash
 */
const restoreFromTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({ 
      where: { 
        [Op.or]: [
          { id: id },
          { boardId: id }
        ],
        userId: userId,
        trashed: true
      } 
    });

    if (!board) {
      return res.status(404).json({ error: `Board with ID ${id} not found in trash` });
    }

    board.trashed = false;
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while restoring the board from trash' });
  }
};

/**
 * Get all shared boards for a user
 */
const getSharedBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    const sharedBoards = await Board.findAll({
      include: [
        {
          model: Collaboration,
          as: 'collaborations',
          where: { userId: userId },
          required: true
        }
      ],
      where: {
        userId: { [Op.ne]: userId }
      }
    });

    res.status(200).json(sharedBoards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching shared boards' });
  }
};

/**
 * Get all favorite boards for a user
 */
const getFavoriteBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    const favoriteBoards = await Board.findAll({
      where: { userId, isPinned: true },
      order: [['updatedAt', 'DESC']]
    });
    res.json(favoriteBoards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching favorite boards' });
  }
};

/**
 * Toggle favorite status of a board
 */
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({ 
      where: { 
        [Op.or]: [
          { id: id },
          { boardId: id }
        ],
        userId: userId 
      } 
    });

    if (!board) {
      return res.status(404).json({ error: `Board with ID ${id} not found` });
    }

    board.isPinned = !board.isPinned;
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while toggling favorite' });
  }
};

/**
 * Add a board to a folder
 */
const addBoardToFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;

    const board = await Board.findOne({ where: { boardId: id } });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    board.folderId = folderId;
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the board to the folder' });
  }
};

/**
 * Get all boards in a folder
 */
const getBoardsByFolderId = async (req, res) => {
  try {
    const { folderId } = req.params;
    const boards = await Board.findAll({
      where: { folderId },
      order: [['updatedAt', 'DESC']]
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching boards by folder ID' });
  }
};

/**
 * Get a public board
 */
const getPublicBoard = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const board = await Board.findOne({
      where: { shareToken, isPublic: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Card,
          as: 'cards'
        }
      ]
    });

    if (!board) {
      return res.status(404).json({ error: 'Shared board not found' });
    }

    if (!board.dominantColor) {
      board.dominantColor = await extractDominantColor(board.background);
      if (board.dominantColor) {
        await Board.update({ dominantColor: board.dominantColor }, { where: { id: board.id } });
      }
    }

    const responseData = {
      id: board.id,
      boardId: board.boardId,
      title: board.title,
      background: board.background,
      dominantColor: board.dominantColor,
      user: board.user,
      cards: board.cards
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the public board' });
  }
};

/**
 * Update board format
 */
const updateBoardFormat = async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.body;

    const board = await Board.findOne({ where: { boardId: id } });

    if (!board) {
      return res.status(404).json({ error: `Board with id ${id} not found` });
    }

    board.format = format;
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the board format' });
  }
};

/**
 * Rename a folder
 */
const renameFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const folder = await Folder.findOne({ where: { id } });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    folder.name = name;
    await folder.save();

    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while renaming the folder' });
  }
};

/**
 * Delete a folder
 */
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findOne({ where: { id } });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    await folder.destroy();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the folder' });
  }
};

/**
 * Get all public boards for a user
 */
const getUserPublicBoards = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const publicBoards = await Board.findAll({
      where: { 
        userId: user.id, 
        isPublic: true,
        trashed: false
      },
      order: [['updatedAt', 'DESC']]
    });

    res.json(publicBoards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching public boards' });
  }
};

/**
 * Get a public board for slideshow
 */
const getPublicBoardForSlideshow = async (req, res) => {
  try {
    const { username, boardId } = req.params;
    const board = await Board.findOne({
      where: { boardId, isPublic: true },
      include: [
        {
          model: User,
          attributes: ['username'],
          where: { username }
        },
        {
          model: Card,
          as: 'cards',
          attributes: ['id', 'subject', 'content', 'image', 'position', 'sectionId'],
          order: [['position', 'ASC']]
        }
      ]
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found or not public' });
    }

    const responseData = {
      id: board.id,
      boardId: board.boardId,
      title: board.title,
      subject: board.subject,
      content: board.content,
      background: board.background,
      dominantColor: board.dominantColor,
      format: board.format,
      sections: board.sections,
      sectionsEnabled: board.sectionsEnabled,
      cards: board.cards
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  getUserBoards,
  toggleSections,
  addSection,
  reorderCards,
  updateSections,
  updateLastViewed,
  moveToTrash,
  getTrashedBoards,
  restoreFromTrash,
  getSharedBoards,
  getFavoriteBoards,
  toggleFavorite,
  addBoardToFolder,
  getBoardsByFolderId,
  getPublicBoard,
  updateBoardFormat,
  renameFolder,
  deleteFolder,
  getUserPublicBoards,
  getPublicBoardForSlideshow
};