const { Op } = require('sequelize');
const sequelize = require('../database/connection');
const Card = require('../models/Card');
const Board = require('../models/Board');
const fs = require('fs');
const path = require('path');

/**
 * Create a new card
 */
const createCard = async (req, res) => {
  try {
    const { subject, content, boardId, sectionId, color } = req.body;
    const image = req.file ? req.file.filename : null;

    const board = await Board.findOne({ where: { boardId: boardId } });

    if (!board) {
      return res.status(400).json({ error: 'Invalid boardId' });
    }

    const newCard = await Card.create({
      subject,
      content,
      image,
      boardId: boardId,
      sectionId: sectionId || null,
      position: 0
    });

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the card', details: error.message });
  }
};

/**
 * Get a card by id
 */
const getCard = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findOne({ where: { cardId: id } });

    if (!card) {
      return res.status(404).json({ error: `Card with cardId ${id} not found` });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the card' });
  }
};

/**
 * Update a card
 */
const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, content, color, sectionId, position } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const card = await Card.findOne({ where: { id } });

    if (!card) {
      return res.status(404).json({ error: `Card with id ${id} not found` });
    }

    if (subject !== undefined) card.subject = subject;
    if (content !== undefined) card.content = content;
    if (color !== undefined) card.color = color;
    if (sectionId !== undefined) card.sectionId = sectionId;
    if (position !== undefined) card.position = position;
    if (image !== undefined) card.image = image;

    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the card' });
  }
};

/**
 * Delete a card
 */
const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findOne({ where: { id } });

    if (!card) {
      return res.status(404).json({ error: `Card with id ${id} not found` });
    }

    await card.destroy();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the card', details: error.message });
  }
};

/**
 * Get all cards for a board
 */
const getBoardCards = async (req, res) => {
  try {
    const { boardId } = req.params;
    const cards = await Card.findAll({ 
      where: { boardId },
      order: [['position', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching board cards' });
  }
};

/**
 * Pin or unpin a card
 */
const pinCard = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { isPinned, boardId } = req.body;
    
    const card = await Card.findByPk(id, { transaction });
    if (!card) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const allCards = await Card.findAll({ 
      where: { boardId },
      order: [['isPinned', 'DESC'], ['position', 'ASC']],
      transaction
    });

    if (isPinned) {
      card.originalPosition = card.position;
      await Card.update(
        { position: sequelize.literal('position + 1') },
        { 
          where: { 
            boardId,
            isPinned: true 
          },
          transaction
        }
      );
      card.position = 0;
    } else {
      const newPosition = card.originalPosition !== null ? card.originalPosition : allCards.length - 1;
      await Card.update(
        { position: sequelize.literal('position - 1') },
        { 
          where: { 
            boardId,
            position: { 
              [Op.gt]: newPosition,
              [Op.lt]: card.position 
            },
            isPinned: false 
          },
          transaction
        }
      );
      card.position = newPosition;
      card.originalPosition = null;
    }

    card.isPinned = isPinned;
    await card.save({ transaction });
    
    await transaction.commit();
    
    const updatedCards = await Card.findAll({
      where: { boardId },
      order: [['isPinned', 'DESC'], ['position', 'ASC']]
    });

    res.json(updatedCards);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'An error occurred while toggling pin status of the card' });
  }
};

/**
 * Update card position
 */
const updateCardPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, sectionId, originalPosition } = req.body;

    const card = await Card.findOne({ where: { id } });

    if (!card) {
      return res.status(404).json({ error: `Card with id ${id} not found` });
    }

    card.position = position;
    if (originalPosition !== undefined) {
      card.originalPosition = originalPosition;
    }
    if (sectionId) {
      card.sectionId = sectionId;
    }

    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the card position' });
  }
};

/**
 * Update positions of multiple cards
 */
const updateCardPositions = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { cardPositions } = req.body;

    await Promise.all(cardPositions.map(async (position) => {
      await Card.update(
        { position: position.newPosition, sectionId: position.newSectionId },
        { where: { id: position.cardId, boardId } }
      );
    }));

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating card positions' });
  }
};

module.exports = {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  getBoardCards,
  pinCard,
  updateCardPosition,
  updateCardPositions
};