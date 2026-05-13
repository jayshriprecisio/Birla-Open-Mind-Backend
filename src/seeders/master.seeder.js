require('dotenv').config();
const masters = require('../models/masters.model');
const sequelize = require('../config/database');

const seedMasters = async () => {
  try {
    console.log('--- Starting Master Data Seeding ---');

    const data = {
      ZoneMaster: [
        { id: 1, zone_name: 'Central', short_form: 'CT' },
        { id: 2, zone_name: 'West', short_form: 'WT' },
        { id: 3, zone_name: 'North', short_form: 'NT' },
      ],
      BrandMaster: [
        { id: 1, name: 'Birla Open Minds International Schools', brand_code: 'BOMIS' },
        { id: 2, name: 'Birla Open Minds Pre School', brand_code: 'BOMPS' },
        { id: 3, name: 'Gopi Birla Memorial School', brand_code: 'GBMS' },
      ],
      AcademicYearMaster: [
        { id: 1, name: '2024 - 25', short_form: '24-25', short_form_2_digit: '25' },
        { id: 2, name: '2025 - 26', short_form: '25-26', short_form_2_digit: '26' },
      ],
      GradeMaster: [
        { id: 1, name: 'Learning Year 1', short_form: 'LY 1', display_order: 1 },
        { id: 2, name: 'Learning Year 2', short_form: 'LY 2', display_order: 2 },
      ],
      GenderMaster: [
        { id: 1, name: 'Female', short_form: 'FE', display_order: 1 },
        { id: 2, name: 'Male', short_form: 'MA', display_order: 2 },
      ],
      SessionMaster: [
        { id: 1, session_name: 'Feb' },
        { id: 2, session_name: 'Jan' },
        { id: 3, session_name: 'May' },
      ],
      BoardMaster: [
        { id: 2, board_code: 'BRD-1', board_name: 'BOB201' },
        { id: 3, board_code: 'BRD-2', board_name: 'BOB203' },
        { id: 7, board_code: 'BRD-3', board_name: 'BOB301' },
      ],
      TermMaster: [
        { id: 1, term_name: 'Term 1', short_form: 'T1' },
        { id: 2, term_name: 'Term 2', short_form: 'T2' },
      ],
      BatchMaster: [
        { id: 1, batch_name: 'Batch 01', short_form: 'B01' },
        { id: 3, batch_name: 'Batch 3', short_form: 'B03' },
      ],
      StreamMaster: [
        { id: 1, name: 'Science', short_form: 'SCI' },
        { id: 2, name: 'Commerce', short_form: 'COM' },
      ]
    };

    for (const [modelName, records] of Object.entries(data)) {
      console.log(`Seeding ${modelName}...`);
      await masters[modelName].bulkCreate(records, { ignoreDuplicates: true });
    }

    console.log('--- Master Data Seeding Completed Successfully ---');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedMasters();
}

module.exports = seedMasters;
