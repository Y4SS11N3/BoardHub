const Board = require('./Board');
const Card = require('./Card');
const Folder = require('./Folder');
const User = require('./User');
const Collaboration = require('./Collaboration');

/**
 * Set up model associations
 */
const setupAssociations = () => {
  // User associations
  User.hasMany(Board, { foreignKey: 'userId', as: 'boards' });
  User.hasMany(Folder, { foreignKey: 'userId', as: 'folders' });
  User.belongsToMany(Board, { through: Collaboration, foreignKey: 'userId', otherKey: 'boardId', as: 'collaboratingBoards' });

  // Board associations
  Board.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Board.hasMany(Card, { foreignKey: 'boardId', as: 'cards', onDelete: 'CASCADE' });
  Board.belongsTo(Folder, { foreignKey: 'folderId', as: 'folder' });
  Board.belongsToMany(User, { through: Collaboration, foreignKey: 'boardId', otherKey: 'userId', as: 'collaborators' });
  Board.hasMany(Collaboration, { foreignKey: 'boardId', as: 'collaborations' });

  // Card associations
  Card.belongsTo(Board, { foreignKey: 'boardId', as: 'board' });

  // Folder associations
  Folder.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Folder.hasMany(Board, { foreignKey: 'folderId', as: 'boards' });

  // Collaboration associations
  Collaboration.belongsTo(User, { foreignKey: 'userId' });
  Collaboration.belongsTo(Board, { foreignKey: 'boardId' });
};

module.exports = {
  setupAssociations,
  Board,
  Card,
  Folder,
  User,
  Collaboration
};