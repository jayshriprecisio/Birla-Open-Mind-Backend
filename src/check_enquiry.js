const { sequelize } = require('./models');
async function run() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("SELECT enquiry_id, enquiry_no, student_name FROM school_enquiries WHERE enquiry_no = 'ENQ-2026-721949' LIMIT 1");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(error.message);
  } finally {
    process.exit();
  }
}
run();
