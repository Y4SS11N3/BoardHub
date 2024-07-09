'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Boards', 'folderId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Folders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Boards', 'folderId');
  }
};