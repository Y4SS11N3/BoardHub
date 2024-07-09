const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Collaboration = sequelize.define('Collaboration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role: {
    type: DataTypes.ENUM('viewer', 'editor', 'owner'),
    defaultValue: 'viewer',
    allowNull: false,
  },
  lastAccessed: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['boardId', 'userId']
    }
  ]
});

module.exports = Collaboration;