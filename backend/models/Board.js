const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Board = sequelize.define('Board', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  boardId: {
    type: DataTypes.STRING(13),
    unique: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Untitled Board',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  sectionsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sections: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  lastViewed: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  trashed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  folderId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  shareToken: {
    type: DataTypes.UUID,
    unique: true,
    allowNull: true,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  background: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dominantColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Wall'
  },
});

Board.associate = (models) => {
  Board.hasMany(models.Card, { foreignKey: 'boardId', as: 'cards' });
};

module.exports = Board;