'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'testuser',
        fullName: 'Hello World',
        email: 'user@boardhub.com',
        password: hashedPassword,
        about: 'This is a demo user',
        language: 'English (US)',
        accountType: 'Student',
        betaFeatures: false,
        keyboardShortcuts: true,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'user@boardhub.com' }, {});
  }
};