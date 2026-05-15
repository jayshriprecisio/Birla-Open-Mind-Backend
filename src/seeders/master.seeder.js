require("dotenv").config();
const { masterModels } = require("../models/masters.model");
const sequelize = require("../config/database");

const seedMasters = async () => {
  try {
    console.log("--- Starting Master Data Seeding ---");

    const data = {
      ZoneMaster: [
        { id: 1, zone_name: "Central", short_form: "CT" },
        { id: 2, zone_name: "West", short_form: "WT" },
        { id: 3, zone_name: "North", short_form: "NT" },
        { id: 4, zone_name: "South", short_form: "ST" },
        { id: 5, zone_name: "East", short_form: "ET" }
      ],
      BrandMaster: [
        {
          id: 1,
          name: "Birla Open Minds International Schools",
          brand_code: "BOMIS",
        },
        { id: 2, name: "Birla Open Minds Pre School", brand_code: "BOMPS" },
        { id: 3, name: "Gopi Birla Memorial School", brand_code: "GBMS" },
      ],
      AcademicYearMaster: [
        {
          id: 1,
          name: "2024 - 25",
          short_form: "24-25",
          short_form_2_digit: "25",
        },
        {
          id: 2,
          name: "2025 - 26",
          short_form: "25-26",
          short_form_2_digit: "26",
        },
        {
          id: 3,
          name: "2026 - 27",
          short_form: "26-27",
          short_form_2_digit: "27",
        },
        {
          id: 4,
          name: "2027 - 28",
          short_form: "27-28",
          short_form_2_digit: "28",
        },
      ],
      GradeMaster: [
        {
          id: 1,
          name: "Learning Year 1",
          short_form: "LY 1",
          display_order: 1,
        },
        {
          id: 2,
          name: "Learning Year 2",
          short_form: "LY 2",
          display_order: 2,
        },
        {
          id: 3,
          name: "Learning Year 3",
          short_form: "LY 3",
          display_order: 3,
        },
        {
          id: 4,
          name: "Grade 1",
          short_form: "G1",
          display_order: 4,
        },
        {
          id: 5,
          name: "Grade 2",
          short_form: "G2",
          display_order: 5,
        },
        {
          id: 6,
          name: "Grade 3",
          short_form: "G3",
          display_order: 6,
        },
      ],
      GenderMaster: [
        { id: 1, name: "Female", short_form: "FE", display_order: 1 },
        { id: 2, name: "Male", short_form: "MA", display_order: 2 },
        { id: 3, name: "Other", short_form: "OT", display_order: 3 },
      ],
      SessionMaster: [
        { id: 1, session_name: "Feb" },
        { id: 2, session_name: "Jan" },
        { id: 3, session_name: "May" },
      ],
      BoardMaster: [
        { id: 1, board_code: "CBSE", board_name: "CBSE" },
        { id: 2, board_code: "ICSE", board_name: "ICSE" },
        { id: 3, board_code: "IB", board_name: "IB" },
        { id: 4, board_code: "IGCSE", board_name: "IGCSE" },
        { id: 5, board_code: "STATE", board_name: "State Board" },
      ],
      ModeOfContactMaster: [
        { id: 1, name: "Walk In", short_form: "WI", display_order: 1 },
        { id: 2, name: "Website", short_form: "WEB", display_order: 2 },
        { id: 3, name: "Phone", short_form: "PH", display_order: 3 },
        { id: 4, name: "Referral", short_form: "REF", display_order: 4 },
        { id: 5, name: "Campaign", short_form: "CAM", display_order: 5 },
        { id: 6, name: "Social Media", short_form: "SM", display_order: 6 },
        { id: 7, name: "Email", short_form: "EM", display_order: 7 },
        { id: 8, name: "WhatsApp", short_form: "WA", display_order: 8 },
      ],
      TermMaster: [
        { id: 1, term_name: "Term 1", short_form: "T1" },
        { id: 2, term_name: "Term 2", short_form: "T2" },
      ],
      BatchMaster: [
        { id: 1, batch_name: "Batch 01", short_form: "B01" },
        { id: 3, batch_name: "Batch 3", short_form: "B03" },
      ],
      StreamMaster: [
        { id: 1, name: "Science", short_form: "SCI" },
        { id: 2, name: "Commerce", short_form: "COM" },
      ],
      AcademicSubjectMaster: [
        { id: 1, name: "Computer", short_form: "CO" },
      ],
      ChequeFavourMaster: [
        {
          id: 1,
          cheque_in_favour_of: "Birla Open Minds International School",
          fees_type: "Birla Open Minds International School",
        },
      ],
      CourseMaster: [
        {
          id: 1,
          course_code: "CRS-1777530534407",
          course_name: "CSS",
          status: "ACTIVE",
          is_deleted: true,
        },
        {
          id: 2,
          course_code: "CRS-1777530687840",
          course_name: "IT",
          status: "INACTIVE",
          is_deleted: true,
        },
        {
          id: 3,
          course_code: "CRS-1777533248143",
          course_name: "CSS",
          status: "ACTIVE",
          is_deleted: false,
        },
      ],
      DivisionMaster: [
        { id: 1, division_name: "A", is_deleted: true },
        { id: 2, division_name: "C" },
        { id: 3, division_name: "B" },
      ],
      ParameterMaster: [
        {
          id: 1,
          parameter_name:
            "Asks questions to extend own understanding about the things seen in the environment",
        },
        {
          id: 2,
          parameter_name: "Attempts to make decisions/choices",
        },
      ],
      PaymentEntityMaster: [
        { id: 1, entity_name: "Maste" },
        { id: 2, entity_name: "Visa" },
      ],
      PdcStatusMaster: [
        {
          id: 1,
          pdc_status: "Action pendings",
          description:
            "Fee Executive created token for PDC but not updated PDC detail in PDC Module",
        },
      ],
      PrePrimaryPhaseMaster: [{ id: 1, phase_name: "Phase 1" }],
      PrePrimarySubjectMaster: [
        { id: 1, name: "Integrated Learning Time", short_form: "IL" },
      ],
      SchoolTimingMaster: [
        {
          id: 1,
          timing_code: "TIM-1777532530231",
          shift_name: "morning shift",
          start_time: "10:30:00",
          end_time: "13:00:00",
        },
      ],
      StudentAttendanceStatusMaster: [
        { id: 1, name: "Absent", short_form: "A" },
        { id: 2, name: "Present", short_form: "P" },
      ],
      SubjectGroupMaster: [
        { id: 1, subject_group_name: "Social Studies" },
        { id: 2, subject_group_name: "Science" },
      ],
      SubjectTypeMaster: [
        { id: 1, name: "Compulsory", short_form: "CO" },
      ],
      TransactionTypeMaster: [
        { id: 1, transaction_type: "Commercial Credit Card" },
        { id: 2, transaction_type: "Credit Card" },
      ],
      WinterDurationMaster: [
        {
          id: 1,
          winter_code: "WIN-1777540088059",
          winter_duration_days: 3,
          winter_start_date: "2026-04-22",
          winter_end_date: "2026-04-28",
        },
        {
          id: 2,
          winter_code: "WIN-1777701589932",
          winter_duration_days: 4,
          winter_start_date: "2026-05-01",
          winter_end_date: "2026-05-10",
        },
      ],
      WinterTimingGapMaster: [{ id: 1, winter_timing_gap: "12:34:00" }],
      BloodGroupMaster: [
        { id: 1, name: "A+", display_order: 1 },
        { id: 2, name: "A-", display_order: 2 },
        { id: 3, name: "B+", display_order: 3 },
        { id: 4, name: "B-", display_order: 4 },
        { id: 5, name: "O+", display_order: 5 },
        { id: 6, name: "O-", display_order: 6 },
        { id: 7, name: "AB+", display_order: 7 },
        { id: 8, name: "AB-", display_order: 8 },
      ],
      ReligionMaster: [
        { id: 1, name: "Hindu", display_order: 1 },
        { id: 2, name: "Muslim", display_order: 2 },
        { id: 3, name: "Christian", display_order: 3 },
        { id: 4, name: "Jain", display_order: 4 },
        { id: 5, name: "Sikh", display_order: 5 },
        { id: 6, name: "Buddhist", display_order: 6 },
        { id: 7, name: "Zorastrian", display_order: 7 },
        { id: 8, name: "Jewish", display_order: 8 },
      ],
      CastMaster: [
        { id: 1, name: "General", short_form: "GR", display_order: 1 },
        { id: 2, name: "OBC", short_form: "OB", display_order: 2 },
        { id: 3, name: "SC", short_form: "SC", display_order: 3 },
        { id: 4, name: "ST", short_form: "ST", display_order: 4 },
        { id: 5, name: "Others", short_form: "OT", display_order: 5 },
      ],
      MotherTongueMaster: [
        { id: 1, name: "Hindi", display_order: 1 },
        { id: 2, name: "English", display_order: 2 },
        { id: 3, name: "Marathi", display_order: 3 },
        { id: 4, name: "Kannada", display_order: 4 },
        { id: 5, name: "Gujarati", display_order: 5 },
        { id: 6, name: "Odia", display_order: 6 },
      ],
      ModeOfPaymentMaster: [
        { id: 1, mode_of_payment_name: "Cash", name_on_receipt: "Cash", visible_to_parent: "YES", visible_to_fee_counter: "YES", order_of_preference: 1 },
        { id: 2, mode_of_payment_name: "Cheque", name_on_receipt: "Cheque", visible_to_parent: "YES", visible_to_fee_counter: "YES", order_of_preference: 2 },
        { id: 3, mode_of_payment_name: "UPI", name_on_receipt: "UPI", visible_to_parent: "YES", visible_to_fee_counter: "YES", order_of_preference: 3 },
        { id: 4, mode_of_payment_name: "Card", name_on_receipt: "Card", visible_to_parent: "YES", visible_to_fee_counter: "YES", order_of_preference: 4 },
      ],
    };

    for (const [modelName, records] of Object.entries(data)) {
      console.log(`Seeding ${modelName}...`);
      await masterModels[modelName].bulkCreate(records, { ignoreDuplicates: true });
    }

    console.log("--- Master Data Seeding Completed Successfully ---");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedMasters();
}

module.exports = seedMasters;
