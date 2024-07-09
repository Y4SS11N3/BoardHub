'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Boards', 'subject', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('Boards', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `UPDATE Boards SET subject = '' WHERE subject IS NULL`
    );
    await queryInterface.sequelize.query(
      `UPDATE Boards SET userId = 0 WHERE userId IS NULL`
    );

    await queryInterface.changeColumn('Boards', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.changeColumn('Boards', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  }
};