require('dotenv').config();
const { sequelize } = require('./models');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Alter columns to BIGINT in school_enquiry_followups
    await sequelize.query('ALTER TABLE school_enquiry_followups ALTER COLUMN created_by TYPE BIGINT USING created_by::text::bigint');
    await sequelize.query('ALTER TABLE school_enquiry_followups ALTER COLUMN updated_by TYPE BIGINT USING updated_by::text::bigint');
    await sequelize.query('ALTER TABLE school_enquiry_followups ALTER COLUMN followup_by TYPE BIGINT USING followup_by::text::bigint');
    
    // Alter columns to BIGINT in school_enquiries
    await sequelize.query('ALTER TABLE school_enquiries ALTER COLUMN created_by TYPE BIGINT USING created_by::text::bigint');
    await sequelize.query('ALTER TABLE school_enquiries ALTER COLUMN updated_by TYPE BIGINT USING updated_by::text::bigint');

    console.log('Columns successfully altered to BIGINT.');
  } catch (error) {
    console.error('Failed to alter columns:', error);
  } finally {
    process.exit();
  }
}

run();
