require('dotenv').config();
const { masterModels } = require('./models/masters.model');

const checkCounts = async () => {
  for (const [name, model] of Object.entries(masterModels)) {
    try {
      const count = await model.count();
      console.log(`Checking ${name}: ${count} records`);
    } catch (e) {
      console.log(`Error checking ${name}: ${e.message}`);
    }
  }
  process.exit();
};

checkCounts();
