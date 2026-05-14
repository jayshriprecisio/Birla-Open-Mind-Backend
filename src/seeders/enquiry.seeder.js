require('dotenv').config();
const { SchoolEnquiry, School } = require('../models');

const seedEnquiries = async () => {
  try {
    console.log('--- Starting Enquiry Seeding ---');

    // Get a valid school_id
    const school = await School.findOne();
    if (!school) {
      console.error('No schools found. Please seed schools first.');
      process.exit(1);
    }

    const enquiries = [
      {
        enquiry_no: 'ENQ-778899',
        school_id: school.school_id,
        student_name: 'Test Student',
        academic_year_id: 1, // 2024-25
        grade_id: 1, // Learning Year 1
        gender_id: 1, // Female
        father_name: 'Test Father',
        father_mobile: '9876543210',
        status: 'NEW'
      },
      {
        enquiry_no: 'ENQ-112233',
        school_id: school.school_id,
        student_name: 'Another Student',
        academic_year_id: 1,
        grade_id: 4, // Grade 1
        gender_id: 2, // Male
        father_name: 'Another Father',
        father_mobile: '9876543211',
        status: 'NEW'
      }
    ];

    for (const enquiryData of enquiries) {
      await SchoolEnquiry.findOrCreate({
        where: { enquiry_no: enquiryData.enquiry_no },
        defaults: enquiryData
      });
      console.log(`Enquiry processed: ${enquiryData.enquiry_no}`);
    }

    console.log('--- Enquiry Seeding Completed Successfully ---');
  } catch (error) {
    console.error('Error during enquiry seeding:', error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedEnquiries();
}

module.exports = seedEnquiries;
