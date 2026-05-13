const { sequelize } = require('./models');
async function run() {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}
run();
