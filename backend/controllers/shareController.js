const { v4: uuidv4 } = require('uuid');
const Board = require('../models/Board');
const User = require('../models/User');
const Card = require('../models/Card');
const { extractDominantColor } = require('../utils/colorExtractor');

/**
 * Generate a share token for a board
 */
const generateShareToken = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findOne({ where: { boardId } });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    if (board.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to share this board' });
    }

    const shareToken = uuidv4();
    board.shareToken = shareToken;
    board.isPublic = true;
    await board.save();

    res.json({ shareToken });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while generating the share token' });
  }
};

/**
 * Get a shared board by its share token
 */
const getSharedBoard = async (req, res) => {
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
          as: 'cards',
          separate: true,
          order: [['position', 'ASC']]
        }
      ]
    });

    if (!board) {
      return res.status(404).json({ error: 'Shared board not found' });
    }

    if (!board.dominantColor) {
      try {
        const extractedColor = await extractDominantColor(board.background);
        board.dominantColor = extractedColor;
        await board.save();
      } catch (error) {
      }
    }

    const cards = await Card.findAll({
      where: { boardId: board.boardId },
      order: [['position', 'ASC']]
    });

    const formattedBoard = {
      id: board.id,
      boardId: board.boardId,
      title: board.title,
      background: board.background,
      dominantColor: board.dominantColor,
      user: board.user,
      cards: cards.map(card => ({
        id: card.id,
        subject: card.subject,
        content: card.content,
        image: card.image,
        position: card.position,
        color: card.color
      }))
    };

    res.json(formattedBoard);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the shared board', details: error.message });
  }
};

/**
 * Revoke a share token for a board
 */
const revokeShareToken = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findOne({ where: { boardId } });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    if (board.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to revoke sharing for this board' });
    }

    board.shareToken = null;
    board.isPublic = false;
    await board.save();

    res.json({ message: 'Share token revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while revoking the share token' });
  }
};

/**
 * Get a shared slideshow by its share token
 */
const getSharedSlideshow = async (req, res) => {
  try {
    const { shareToken } = req.params;

    const board = await Board.findOne({
      where: { shareToken, isPublic: true },
      attributes: ['id', 'boardId', 'title', 'background', 'dominantColor', 'sections', 'sectionsEnabled'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: Card,
          as: 'cards',
          attributes: ['id', 'subject', 'content', 'image', 'position', 'color'],
          order: [['position', 'ASC']]
        }
      ]
    });

    if (!board) {
      return res.status(404).json({ error: 'Shared slideshow not found' });
    }

    if (!board.dominantColor) {
      try {
        board.dominantColor = await extractDominantColor(board.background);
        await board.save();
      } catch (error) {
      }
    }

    const formattedBoard = {
      id: board.id,
      boardId: board.boardId,
      title: board.title,
      background: board.background,
      dominantColor: board.dominantColor,
      user: board.user,
      cards: board.cards,
      sections: board.sections,
      sectionsEnabled: board.sectionsEnabled
    };

    res.json(formattedBoard);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the shared slideshow' });
  }
};

module.exports = {
  generateShareToken,
  getSharedBoard,
  revokeShareToken,
  getSharedSlideshow
};