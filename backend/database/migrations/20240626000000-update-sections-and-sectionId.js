'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Boards', 'sections', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addIndex('Cards', ['sectionId']);

    await queryInterface.addIndex('Cards', ['boardId', 'sectionId']);
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`
        SELECT CONSTRAINT_NAME
        INTO @constraint_name
        FROM information_schema.TABLE_CONSTRAINTS
        WHERE TABLE_NAME = 'Cards'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND CONSTRAINT_SCHEMA = DATABASE()
        LIMIT 1;

        SET @query = IF(@constraint_name IS NOT NULL,
                        CONCAT('ALTER TABLE Cards DROP FOREIGN KEY ', @constraint_name),
                        'SELECT 1');

        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
      `);
    } catch (error) {
      //
    }

    // Remove added indexes
    try {
      await queryInterface.removeIndex('Cards', ['sectionId']);
    } catch (error) {
      //
    }

    try {
      await queryInterface.removeIndex('Cards', ['boardId', 'sectionId']);
    } catch (error) {
      //
    }

    // Revert sections column type if needed
    await queryInterface.changeColumn('Boards', 'sections', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  }
};