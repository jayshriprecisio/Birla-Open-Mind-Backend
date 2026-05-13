const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SchoolEnquiry = sequelize.define('SchoolEnquiry', {
  enquiry_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  school_id: { type: DataTypes.UUID },
  branch_id: { type: DataTypes.INTEGER },
  enquiry_no: { type: DataTypes.STRING(50), unique: true },
  
  enquiry_purpose_id: { type: DataTypes.INTEGER },
  enquiry_for_id: { type: DataTypes.INTEGER },
  academic_session_id: { type: DataTypes.INTEGER },
  board_id: { type: DataTypes.INTEGER },
  grade_id: { type: DataTypes.INTEGER },
  batch_id: { type: DataTypes.INTEGER },
  school_type_id: { type: DataTypes.INTEGER },
  source_id: { type: DataTypes.INTEGER },
  sub_source_id: { type: DataTypes.INTEGER },
  lead_stage_id: { type: DataTypes.INTEGER },
  contact_mode_id: { type: DataTypes.INTEGER },

  student_name: { type: DataTypes.STRING(255), allowNull: false },
  dob: { type: DataTypes.DATEONLY },
  gender_id: { type: DataTypes.INTEGER },
  aadhaar_no: { type: DataTypes.STRING(20) },
  current_school: { type: DataTypes.STRING(255) },
  current_board_id: { type: DataTypes.INTEGER },
  current_grade_id: { type: DataTypes.INTEGER },

  father_name: { type: DataTypes.STRING(255) },
  father_mobile: { type: DataTypes.STRING(20) },
  father_email: { type: DataTypes.STRING(255) },
  mother_name: { type: DataTypes.STRING(255) },
  mother_mobile: { type: DataTypes.STRING(20) },
  mother_email: { type: DataTypes.STRING(255) },
  guardian_name: { type: DataTypes.STRING(255) },
  guardian_mobile: { type: DataTypes.STRING(20) },
  preferred_contact_id: { type: DataTypes.INTEGER },

  address_line1: { type: DataTypes.STRING(1000) },
  address_line2: { type: DataTypes.STRING(1000) },
  address_line3: { type: DataTypes.STRING(1000) },
  pincode: { type: DataTypes.STRING(10) },
  country: { type: DataTypes.STRING(50) },
  state: { type: DataTypes.STRING(50) },
  city: { type: DataTypes.STRING(50) },

  is_concession: { type: DataTypes.BOOLEAN, defaultValue: false },
  concession_type_id: { type: DataTypes.INTEGER },
  is_referral: { type: DataTypes.BOOLEAN, defaultValue: false },
  referral_name: { type: DataTypes.INTEGER },

  current_owner: { type: DataTypes.STRING(255) },
  assigned_to: { type: DataTypes.INTEGER },
  interaction_mode_id: { type: DataTypes.INTEGER },
  interaction_status_id: { type: DataTypes.INTEGER },

  next_followup_date: { type: DataTypes.DATEONLY },
  priority_tag: { type: DataTypes.STRING(20), defaultValue: 'WARM' },
  status: { type: DataTypes.STRING(50), defaultValue: 'NEW' },
  
  created_by: { type: DataTypes.UUID },
  updated_by: { type: DataTypes.UUID },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'school_enquiries',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SchoolEnquiry;
