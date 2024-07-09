'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Boards', 'sectionsEnabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
    await queryInterface.addColumn('Boards', 'sections', {
      type: Sequelize.JSON,
      defaultValue: [],
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Boards', 'sectionsEnabled');
    await queryInterface.removeColumn('Boards', 'sections');
  }
};