'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'followers', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: '[]'
    });

    await queryInterface.addColumn('Users', 'following', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: '[]'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'followers');
    await queryInterface.removeColumn('Users', 'following');
  }
};