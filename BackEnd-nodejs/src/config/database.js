const { Sequelize } = require('sequelize');
const { DB_URI, DB_DIALECT, NODE_ENV } = require('./environment');
const logger = require('../utils/logger');

const sequelize = new Sequelize(DB_URI, {
  dialect: DB_DIALECT,
  logging: NODE_ENV === 'development' ? (msg) => logger.info(msg) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('🔗 Connection has been established successfully');
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

const closeDB = async () => {
  try {
    await sequelize.close();
    logger.info('🔒 Connection has been closed succesfully');
  } catch (error) {
    logger.error('❌ Unable to close connection:', error);
    throw error;
  }
}

module.exports = { sequelize, connectDB, closeDB }