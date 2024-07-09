const { Sequelize } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize('', config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

async function createDatabase() {
  try {
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`);
    console.log(`Database '${config.database}' created successfully.`);
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await sequelize.close();
  }
}

createDatabase();