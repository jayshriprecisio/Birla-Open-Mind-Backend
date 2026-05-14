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
      },
      {
        enquiry_no: 'ENQ-2026-001',
        school_id: school.school_id,
        student_name: 'Aarav Sharma',
        academic_year_id: 2, // 2025-26
        grade_id: 5, // Grade 2
        gender_id: 2,
        father_name: 'Rajesh Sharma',
        father_mobile: '9988776655',
        status: 'ACCEPTED'
      },
      {
        enquiry_no: 'ENQ-2026-002',
        school_id: school.school_id,
        student_name: 'Ananya Iyer',
        academic_year_id: 2,
        grade_id: 6, // Grade 3
        gender_id: 1,
        father_name: 'Subramanian Iyer',
        father_mobile: '8877665544',
        status: 'PENDING'
      },
      {
        enquiry_no: 'ENQ-2026-003',
        school_id: school.school_id,
        student_name: 'Vihaan Gupta',
        academic_year_id: 2,
        grade_id: 1,
        gender_id: 2,
        father_name: 'Amit Gupta',
        father_mobile: '7766554433',
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
