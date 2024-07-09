'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Boards', 'shareToken', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.addColumn('Boards', 'isPublic', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Boards', 'shareToken');
    await queryInterface.removeColumn('Boards', 'isPublic');
  }
};