require("dotenv").config();
const { SchoolEnquiry, School } = require("../models");
const crypto = require("crypto");

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharva", "Ananya", "Diya", "Avni", "Kavya", "Saanvi", "Myra", "Aadhya", "Riya", "Kriti", "Neha", "Rahul", "Priya"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Reddy", "Kumar", "Rao", "Das", "Joshi", "Chauhan"];
const cities = ["Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Kolkata", "Chennai", "Indore", "Bhopal", "Jaipur"];

const usedMobiles = new Set();
const generateUniquePhone = () => {
  let phone;
  do {
    phone = "9";
    for (let i = 0; i < 9; i++) {
      phone += Math.floor(Math.random() * 10);
    }
  } while (usedMobiles.has(phone));
  usedMobiles.add(phone);
  return phone;
};

const usedEnquiryNos = new Set();
const generateUniqueEnquiryNo = (index) => {
  let enqNo;
  do {
    const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
    enqNo = `ENQ-2026-${String(index).padStart(4, '0')}-${randomPart}`;
  } while (usedEnquiryNos.has(enqNo));
  usedEnquiryNos.add(enqNo);
  return enqNo;
};

const seedEnquiries = async () => {
  try {
    console.log("--- Starting Enquiry Seeding ---");

    const schools = await School.findAll();
    if (!schools || schools.length === 0) {
      console.error("No schools found. Please seed schools first.");
      process.exit(1);
    }

    const enquiries = [];
    let enqCounter = 1;

    for (const school of schools) {
      // Create 2 enquiries per school
      for (let i = 0; i < 2; i++) {
        const studentFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const studentLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fatherName = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + studentLastName;
        const motherName = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + studentLastName;
        const guardianName = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + studentLastName;

        const aadhaarNo = String(Math.floor(100000000000 + Math.random() * 900000000000));
        const enqNo = generateUniqueEnquiryNo(enqCounter);

        const fatherMobile = generateUniquePhone();
        const motherMobile = generateUniquePhone();
        const guardianMobile = generateUniquePhone();

        const city = cities[Math.floor(Math.random() * cities.length)];

        enquiries.push({
          enquiry_no: enqNo,
          school_id: school.school_id,
          branch_id: 1,
          enquiry_purpose_id: Math.random() > 0.5 ? 1 : 2, // Admission or Inquiry
          enquiry_for_id: 1, // New Admission
          academic_session_id: 1,
          student_name: `${studentFirstName} ${studentLastName}`,
          dob: `201${Math.floor(Math.random() * 5 + 4)}-0${Math.floor(Math.random() * 9 + 1)}-15`, // Random year 2014-2018
          aadhaar_no: aadhaarNo,
          academic_year_id: 1,
          board_id: 1, // CBSE
          grade_id: Math.floor(Math.random() * 6 + 1), // Grade 1 to 6
          batch_id: 1, // Batch A
          gender_id: Math.random() > 0.5 ? 1 : 2,
          school_type_id: 1, // Day School
          source_id: 1, // Website
          sub_source_id: 1, // Online Ad
          lead_stage_id: 1, // New Lead
          contact_mode_id: 1, // Phone Call

          current_school: `Previous School ${city}`,
          current_board_id: 1, // CBSE
          current_grade_id: Math.floor(Math.random() * 6 + 1),

          father_name: fatherName,
          father_mobile: fatherMobile,
          father_email: `${fatherName.replace(/\s/g, '').toLowerCase()}@example.com`,

          mother_name: motherName,
          mother_mobile: motherMobile,
          mother_email: `${motherName.replace(/\s/g, '').toLowerCase()}@example.com`,

          guardian_name: guardianName,
          guardian_mobile: guardianMobile,
          preferred_contact_id: Math.floor(Math.random() * 3 + 1), // 1: Father, 2: Mother, 3: Guardian

          address_line1: `${Math.floor(Math.random() * 100) + 1}, Main Street`,
          address_line2: `${city} Area`,
          address_line3: `Near Landmark`,
          pincode: `40000${Math.floor(Math.random() * 9)}`,
          country: "India",
          state: "State",
          city: city,

          status: "NEW",
        });

        enqCounter++;
      }
    }

    // Insert the enquiries in chunks to handle a large number properly
    const CHUNK_SIZE = 100;
    for (let i = 0; i < enquiries.length; i += CHUNK_SIZE) {
      const chunk = enquiries.slice(i, i + CHUNK_SIZE);
      for (const enquiryData of chunk) {
        await SchoolEnquiry.findOrCreate({
          where: { enquiry_no: enquiryData.enquiry_no },
          defaults: enquiryData,
        });
      }
      console.log(`Processed ${Math.min(i + CHUNK_SIZE, enquiries.length)} / ${enquiries.length} enquiries...`);
    }

    console.log(`--- Enquiry Seeding Completed Successfully. Seeded ${enquiries.length} dynamic enquiries ---`);
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
