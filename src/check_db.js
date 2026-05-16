require('dotenv').config();
const { sequelize } = require('./models');
async function run() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("SELECT COUNT(*) FROM school_enquiry_followups");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}
run();
