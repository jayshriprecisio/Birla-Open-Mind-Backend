require("dotenv").config();
const { SchoolEnquiry, School } = require("../models");

const seedEnquiries = async () => {
  try {
    console.log("--- Starting Enquiry Seeding ---");

    // Get a valid school_id
    const school = await School.findOne();
    if (!school) {
      console.error("No schools found. Please seed schools first.");
      process.exit(1);
    }

    const enquiries = [
      {
        enquiry_no: "ENQ-2026-001",
        school_id: school.school_id,
        branch_id: 1,
        enquiry_purpose_id: 1, // Admission
        enquiry_for_id: 1, // New Admission
        academic_session_id: 1,
        student_name: "Test Student",
        dob: "2018-05-15",
        aadhaar_no: "123456789012",
        academic_year_id: 1, // 2024-25
        board_id: 1, // CBSE
        grade_id: 1, // Learning Year 1
        batch_id: 1, // Batch A
        gender_id: 1, // Female
        school_type_id: 1, // Day School
        source_id: 1, // Website
        sub_source_id: 1, // Online Ad
        lead_stage_id: 1, // New Lead
        contact_mode_id: 1, // Phone Call

        current_school: "Test School",
        current_board_id: 1, // CBSE
        current_grade_id: 1, // Learning Year 1

        father_name: "Test Father",
        father_mobile: "9876543210",
        father_email: "test.father@example.com",

        mother_name: "Test Mother",
        mother_mobile: "9876543211",
        mother_email: "test.mother@example.com",

        guardian_name: "Test Guardian",
        guardian_mobile: "9876543212",
        preferred_contact_id: 1, // Father

        address_line1: "123 Test Street",
        address_line2: "Test Area",
        address_line3: "Test City",
        pincode: "123456",
        country: "Test Country",
        state: "Test State",
        city: "Test City",

        status: "NEW",
      },
      {
        enquiry_no: "ENQ-2026-002",
        school_id: school.school_id,
        branch_id: 1,
        enquiry_purpose_id: 1, // Admission
        academic_session_id: 1,
        enquiry_for_id: 1, // New Admission
        student_name: "Another Student",
        dob: "2018-05-15",
        aadhaar_no: "123456789013",
        academic_year_id: 1,
        board_id: 1, // CBSE
        grade_id: 4, // Grade 1
        batch_id: 1, // Batch
        gender_id: 2, // Male
        school_type_id: 1, // Day School
        source_id: 1, // Website
        sub_source_id: 1, // Online Ad
        lead_stage_id: 1, // New Lead
        contact_mode_id: 1, // Phone Call

        current_school: "Test School",
        current_board_id: 1, // CBSE
        current_grade_id: 1, // Learning Year 1

        father_name: "Test Father",
        father_mobile: "9876543210",
        father_email: "test.father@example.com",

        mother_name: "Test Mother",
        mother_mobile: "9876543211",
        mother_email: "test.mother@example.com",

        guardian_name: "Test Guardian",
        guardian_mobile: "9876543212",
        preferred_contact_id: 1, // Father

        address_line1: "123 Test Street",
        address_line2: "Test Area",
        address_line3: "Test City",
        pincode: "123456",
        country: "Test Country",
        state: "Test State",
        city: "Test City",

        status: "NEW",
      },
      {
        enquiry_no: "ENQ-2026-003",
        school_id: school.school_id,
        branch_id: 1,
        enquiry_purpose_id: 1, // Admission
        enquiry_for_id: 1, // New Admission
        academic_session_id: 1,
        student_name: "Aarav Sharma",
        dob: "2018-05-15",
        aadhaar_no: "123456789014",
        academic_year_id: 2, // 2025-26
        board_id: 1, // CBSE
        grade_id: 5, // Grade 2
        batch_id: 1, // Batch A
        gender_id: 2,
        school_type_id: 1, // Day School
        source_id: 1, // Website
        sub_source_id: 1, // Online Ad
        lead_stage_id: 1, // New Lead
        contact_mode_id: 1, // Phone Call

        current_school: "Test School",
        current_board_id: 1, // CBSE
        current_grade_id: 1, // Learning Year 1

        father_name: "Test Father",
        father_mobile: "9876543210",
        father_email: "test.father@example.com",

        mother_name: "Test Mother",
        mother_mobile: "9876543211",
        mother_email: "test.mother@example.com",

        guardian_name: "Test Guardian",
        guardian_mobile: "9876543212",
        preferred_contact_id: 1, // Father

        address_line1: "123 Test Street",
        address_line2: "Test Area",
        address_line3: "Test City",
        pincode: "123456",
        country: "Test Country",
        state: "Test State",
        city: "Test City",

        status: "NEW",
      },
      {
        enquiry_no: "ENQ-2026-004",
        school_id: school.school_id,
        branch_id: 1,
        enquiry_purpose_id: 2, // Inquiry
        enquiry_for_id: 1, // New Admission
        academic_session_id: 1,
        student_name: "Ananya Iyer",
        dob: "2018-05-15",
        aadhaar_no: "123456789015",
        academic_year_id: 2,
        board_id: 1, // CBSE
        grade_id: 6, // Grade 3
        batch_id: 1, // Batch A
        gender_id: 1,
        school_type_id: 1, // Day School
        source_id: 1, // Website
        sub_source_id: 1, // Online Ad
        lead_stage_id: 1, // New Lead
        contact_mode_id: 1, // Phone Call

        current_school: "Test School",
        current_board_id: 1, // CBSE
        current_grade_id: 1, // Learning Year 1

        father_name: "Test Father",
        father_mobile: "9876543210",
        father_email: "test.father@example.com",

        mother_name: "Test Mother",
        mother_mobile: "9876543211",
        mother_email: "test.mother@example.com",

        guardian_name: "Test Guardian",
        guardian_mobile: "9876543212",
        preferred_contact_id: 1, // Father

        address_line1: "123 Test Street",
        address_line2: "Test Area",
        address_line3: "Test City",
        pincode: "123456",
        country: "Test Country",
        state: "Test State",
        city: "Test City",

        status: "NEW",
      },
      {
        enquiry_no: "ENQ-2026-005",
        school_id: school.school_id,
        branch_id: 1,
        enquiry_purpose_id: 2, // Inquiry
        enquiry_for_id: 1, // New Admission
        academic_session_id: 1,
        student_name: "Vihaan Gupta",
        dob: "2018-05-15",
        aadhaar_no: "123456789016",
        academic_year_id: 1,
        board_id: 1, // CBSE
        grade_id: 1,
        batch_id: 1, // Batch A
        gender_id: 2,
        school_type_id: 1, // Day School
        source_id: 1, // Website
        sub_source_id: 1, // Online Ad
        lead_stage_id: 1, // New Lead
        contact_mode_id: 1, // Phone Call

        current_school: "Test School",
        current_board_id: 1, // CBSE
        current_grade_id: 1, // Learning Year 1

        father_name: "Test Father",
        father_mobile: "9876543210",
        father_email: "test.father@example.com",

        mother_name: "Test Mother",
        mother_mobile: "9876543211",
        mother_email: "test.mother@example.com",

        guardian_name: "Test Guardian",
        guardian_mobile: "9876543212",
        preferred_contact_id: 1, // Father

        address_line1: "123 Test Street",
        address_line2: "Test Area",
        address_line3: "Test City",
        pincode: "123456",
        country: "Test Country",
        state: "Test State",
        city: "Test City",

        status: "NEW",
      },
    ];

    for (const enquiryData of enquiries) {
      await SchoolEnquiry.findOrCreate({
        where: { enquiry_no: enquiryData.enquiry_no },
        defaults: enquiryData,
      });
      console.log(`Enquiry processed: ${enquiryData.enquiry_no}`);
    }

    console.log("--- Enquiry Seeding Completed Successfully ---");
  } catch (error) {
    console.error("Error during enquiry seeding:", error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedEnquiries();
}

module.exports = seedEnquiries;
