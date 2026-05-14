require('dotenv').config();
const { School } = require('../models');

const seedSchools = async () => {
  try {
    console.log('--- Starting School Seeding ---');

    const schools = [
      {
        school_id: 'e2a6f2b4-8e1a-4d3b-9a2c-7f5e1a2b3c4d',
        school_code: 'BOM-MUM-01',
        school_name: 'Birla Open Minds School Mumbai',
        brand_id: 1, // BOMIS
        brand_code: 'BOMIS',
        zone_id: 2, // West
        board: 'CBSE',
        city: 'Mumbai',
        state_province: 'Maharashtra',
        session_month: 'April',
        address_line1: 'Mumbai Address Line 1',
        address_line2: 'Mumbai Address Line 2',
        pin_code: '400001',
        phone_number: '9876543210',
        official_email: 'mumbai@birlaopenminds.edu.in'
      },
      {
        school_id: 'a1b2c3d4-e5f6-4a5b-bc6d-7e8f9a0b1c2d',
        school_code: 'BOM-DEL-01',
        school_name: 'Birla Open Minds School Delhi',
        brand_id: 1, // BOMIS
        brand_code: 'BOMIS',
        zone_id: 3, // North
        board: 'CBSE',
        city: 'Delhi',
        state_province: 'Delhi',
        session_month: 'April',
        address_line1: 'Delhi Address Line 1',
        address_line2: 'Delhi Address Line 2',
        pin_code: '110001',
        phone_number: '9876543211',
        official_email: 'delhi@birlaopenminds.edu.in'
      },
      {
        school_id: 'f9e8d7c6-b5a4-4321-8765-4d3c2b1a0e9f',
        school_code: 'BOM-BLR-01',
        school_name: 'Birla Open Minds Pre School Bangalore',
        brand_id: 2, // BOMPS
        brand_code: 'BOMPS',
        zone_id: 4, // South
        board: 'ICSE',
        city: 'Bangalore',
        state_province: 'Karnataka',
        session_month: 'June',
        address_line1: 'Bangalore Address Line 1',
        address_line2: 'Bangalore Address Line 2',
        pin_code: '560001',
        phone_number: '9876543212',
        official_email: 'bangalore@birlaopenminds.edu.in'
      },
      {
        school_id: 'd4c3b2a1-0e9f-4d3c-82b1-a0e9f8d7c6b5',
        school_code: 'BOM-CHN-01',
        school_name: 'Birla Open Minds Pre School Chennai',
        brand_id: 2, // BOMPS
        brand_code: 'BOMPS',
        zone_id: 4, // South
        board: 'CBSE',
        city: 'Chennai',
        state_province: 'Tamil Nadu',
        session_month: 'June',
        address_line1: 'Chennai Address Line 1',
        address_line2: 'Chennai Address Line 2',
        pin_code: '600001',
        phone_number: '9876543213',
        official_email: 'chennai@birlaopenminds.edu.in'
      },
      {
        school_id: 'c2b1a0e9-f8d7-4c6b-85a4-3210e9f8d7c6',
        school_code: 'BOM-HYD-01',
        school_name: 'Birla Open Minds School Hyderabad',
        brand_id: 1, // BOMIS
        brand_code: 'BOMIS',
        zone_id: 4, // South
        board: 'CBSE',
        city: 'Hyderabad',
        state_province: 'Telangana',
        session_month: 'April',
        address_line1: 'Hyderabad Address Line 1',
        address_line2: 'Hyderabad Address Line 2',
        pin_code: '500001',
        phone_number: '9876543214',
        official_email: 'hyderabad@birlaopenminds.edu.in'
      }
    ];

    for (const schoolData of schools) {
      await School.findOrCreate({
        where: { school_code: schoolData.school_code },
        defaults: schoolData
      });
      console.log(`School processed: ${schoolData.school_code}`);
    }

    console.log('--- School Seeding Completed Successfully ---');
  } catch (error) {
    console.error('Error during school seeding:', error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedSchools();
}

module.exports = seedSchools;
