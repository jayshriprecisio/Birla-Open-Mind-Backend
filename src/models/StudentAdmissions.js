const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentAdmissions = sequelize.define(
  "StudentAdmissions",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    registration_no: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    enrollment_no: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    enquiry_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // use model - AcademicYearMaster
    academic_year_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // use model - School
    school_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // use model - GradeMaster
    grade_applying_for_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // use model - BoardMaster
    board_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    // Student Details
    student_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // use model - GenderMaster
    gender_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // use model - GradeMaster
    grade_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // use model - BloodGroupMaster
    blood_group_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // use model - ReligionMaster
    religion_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // use model - CastMaster
    cast_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // use model - MotherTongueMaster
    mother_tongue_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    place_of_birth: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    prev_school_tc_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    prev_school_leaving_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    prev_class_passed: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    prev_class_percentage: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    // Father's Details
    father_name: { type: DataTypes.STRING(255) },
    father_mobile: { type: DataTypes.STRING(20) },
    father_email: { type: DataTypes.STRING(255) },
    father_occupation: { type: DataTypes.STRING(255) },
    father_aadhar_no: { type: DataTypes.STRING(20) },
    father_pan_no: { type: DataTypes.STRING(20) },

    // Father's Employer Details
    father_employer_name: { type: DataTypes.STRING(255) },
    father_designation: { type: DataTypes.STRING(255) },
    father_annual_income: { type: DataTypes.STRING(50) },
    father_employer_address: { type: DataTypes.STRING(1000) },
    father_employer_city: { type: DataTypes.STRING(100) },
    father_employer_state: { type: DataTypes.STRING(100) },
    father_employer_pincode: { type: DataTypes.STRING(20) },
    father_employer_country: { type: DataTypes.STRING(100) },

    // Mother's Details
    mother_name: { type: DataTypes.STRING(255) },
    mother_mobile: { type: DataTypes.STRING(20) },
    mother_email: { type: DataTypes.STRING(255) },
    mother_occupation: { type: DataTypes.STRING(255) },
    mother_aadhar_no: { type: DataTypes.STRING(20) },
    mother_pan_no: { type: DataTypes.STRING(20) },

    // Mother's Employer Details
    mother_employer_name: { type: DataTypes.STRING(255) },
    mother_designation: { type: DataTypes.STRING(255) },
    mother_annual_income: { type: DataTypes.STRING(50) },
    mother_employer_address: { type: DataTypes.STRING(1000) },
    mother_employer_city: { type: DataTypes.STRING(100) },
    mother_employer_state: { type: DataTypes.STRING(100) },
    mother_employer_pincode: { type: DataTypes.STRING(20) },
    mother_employer_country: { type: DataTypes.STRING(100) },

    // Guardian's Details
    guardian_name: { type: DataTypes.STRING(255) },
    guardian_mobile: { type: DataTypes.STRING(20) },
    guardian_email: { type: DataTypes.STRING(255) },
    guardian_relation: { type: DataTypes.STRING(100) },
    guardian_aadhar_no: { type: DataTypes.STRING(20) },
    guardian_pan_no: { type: DataTypes.STRING(20) },

    // Address Details
    address: { type: DataTypes.STRING(1000) },
    city: { type: DataTypes.STRING(100) },
    state: { type: DataTypes.STRING(100) },
    country: { type: DataTypes.STRING(100) },
    pincode: { type: DataTypes.STRING(20) },

    // Additional Admission Details
    admission_no: { type: DataTypes.STRING(50) },
    medical_conditions: { type: DataTypes.TEXT },
    emergency_contact: { type: DataTypes.STRING(255) },

    // Student Custody Details
    custody_situation: { type: DataTypes.TEXT },

    // Payment Details
    // use model - ModeOfPaymentMaster
    payment_mode_id: { type: DataTypes.BIGINT },
    admission_fee_amount: { type: DataTypes.DECIMAL(10, 2) },
    payment_status: {
      type: DataTypes.STRING(30),
      defaultValue: "PENDING",
    },
    cheque_no: { type: DataTypes.STRING(50) },
    cheque_bank_name: { type: DataTypes.STRING(255) },
    is_cheque_cleared: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    upi_reference: { type: DataTypes.STRING(100) },
    card_last_four: { type: DataTypes.STRING(4) },

    // Metadata
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "PENDING",
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by: { type: DataTypes.BIGINT },
    updated_by: { type: DataTypes.BIGINT },
  },
  {
    tableName: "student_admissions",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = StudentAdmissions;
