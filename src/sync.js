require('dotenv').config();
const { sequelize } = require('./models');

const syncDatabase = async () => {
  try {
    console.log('--- Starting Database Synchronization ---');
    
    // .sync() will create the tables if they don't exist
    // { alter: true } will update existing tables to match the model definitions
    await sequelize.sync({ alter: true });
    
    console.log('--- Database Synchronized Successfully ---');
  } catch (error) {
    console.error('Error during database synchronization:', error);
  } finally {
    process.exit();
  }
};

syncDatabase();
