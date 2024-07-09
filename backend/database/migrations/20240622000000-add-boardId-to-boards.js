'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, add the column allowing null values
    await queryInterface.addColumn('Boards', 'boardId', {
      type: Sequelize.STRING(13),
      allowNull: true,
      unique: true,
      after: 'id'
    });

    const [boards] = await queryInterface.sequelize.query(
      'SELECT id FROM Boards WHERE boardId IS NULL;'
    );
    for (const board of boards) {
      await queryInterface.sequelize.query(
        'UPDATE Boards SET boardId = ? WHERE id = ?',
        {
          replacements: [uuidv4().slice(0, 13), board.id],
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
    }

    await queryInterface.changeColumn('Boards', 'boardId', {
      type: Sequelize.STRING(13),
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Boards', 'boardId');
  }
};