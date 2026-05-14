require('dotenv').config();
const { School } = require('../models');

const seedSchools = async () => {
  try {
    console.log('--- Starting School Seeding ---');

    const schools = [
      {
        school_id: '11111111-1111-1111-1111-111111111111',
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
        school_id: '22222222-2222-2222-2222-222222222222',
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
        school_id: '33333333-3333-3333-3333-333333333333',
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
        school_id: '44444444-4444-4444-4444-444444444444',
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
        school_id: '55555555-5555-5555-5555-555555555555',
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
