'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Boards', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Untitled Board'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Boards', 'title');
  }
};