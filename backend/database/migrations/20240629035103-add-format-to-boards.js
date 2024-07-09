'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Boards', 'format', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Wall'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Boards', 'format');
  }
};