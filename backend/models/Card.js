const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isValidFilename(value) {
        if (value && !/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(value)) {
          throw new Error('Invalid filename format');
        }
      }
    }
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  originalPosition: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  boardId: {
    type: DataTypes.STRING(13),
    allowNull: false,
  },
  sectionId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

Card.associate = (models) => {
  Card.belongsTo(models.Board, { foreignKey: 'boardId', as: 'board' });
};

module.exports = Card;