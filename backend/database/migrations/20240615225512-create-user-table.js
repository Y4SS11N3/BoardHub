'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'English (US)'
      },
      accountType: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Student'
      },
      betaFeatures: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      keyboardShortcuts: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      avatarUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};