require('dotenv').config();
const { sequelize } = require('./models');

const syncDatabase = async () => {
  try {
    console.log('--- Starting Database Synchronization ---');
    
    // Pre-sync fix for PostgreSQL type casting issues
    // Sequelize sync({ alter: true }) fails when changing UUID/VARCHAR to BIGINT automatically
    console.log('--- Checking for PostgreSQL type casting issues ---');
    const [results] = await sequelize.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE (column_name IN ('created_by', 'updated_by', 'followup_by', 'deleted_by', 'assigned_to') OR column_name LIKE '%_by')
      AND data_type != 'bigint' 
      AND table_schema = 'public'
      AND table_name NOT LIKE 'pg_%'
    `);

    for (const row of results) {
      try {
        console.log(`Manually altering ${row.table_name}.${row.column_name} to BIGINT...`);
        await sequelize.query(`ALTER TABLE "${row.table_name}" ALTER COLUMN "${row.column_name}" TYPE BIGINT USING "${row.column_name}"::text::bigint`);
      } catch (err) {
        console.warn(`Could not alter ${row.table_name}.${row.column_name}: ${err.message}`);
      }
    }

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
