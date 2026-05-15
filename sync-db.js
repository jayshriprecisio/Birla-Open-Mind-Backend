require('dotenv').config();
const { sequelize, SourceMaster, AdmissionInquiry } = require('./src/models');

async function sync() {
  try {
    console.log('--- Starting Database Sync ---');
    // Only sync specific models to avoid issues with legacy tables
    await SourceMaster.sync({ alter: true });
    await AdmissionInquiry.sync({ alter: true });
    console.log('--- Database Sync Completed ---');
    process.exit(0);
  } catch (error) {
    console.error('Error during sync:', error);
    process.exit(1);
  }
}

sync();
