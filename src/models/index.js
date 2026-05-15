const sequelize = require('../config/database');
const User = require('./User');
const School = require('./School');
const SchoolPartner = require('./SchoolPartner');
const SchoolContact = require('./SchoolContact');
const masters = require('./masters.model');
const { ZoneMaster, BrandMaster, GradeMaster, PaymentEntityMaster, BoardMaster, SessionMaster, GenderMaster, ModeOfPaymentMaster, AcademicYearMaster, BloodGroupMaster, ReligionMaster, CastMaster, MotherTongueMaster } = masters;
const SchoolEnquiry = require('./SchoolEnquiry');
const SchoolEnquirySibling = require('./SchoolEnquirySibling');
const SchoolEnquiryFollowup = require('./SchoolEnquiryFollowup');
const AdmissionInquiry = require('./AdmissionInquiry');
const StudentAdmissions = require('./StudentAdmissions');
const PasswordReset = require('./PasswordReset');
const InteractionMaster = require('./InteractionMaster');
const PriorityMaster = require('./PriorityMaster');
const StageMaster = require('./StageMaster');
const FollowupStatusMaster = require('./FollowupStatusMaster');
const { SourceMaster } = masters;

// Associations

// School <-> Partner
School.hasMany(SchoolPartner, { foreignKey: 'school_id', as: 'partners' });
SchoolPartner.belongsTo(School, { foreignKey: 'school_id' });

// School <-> Contact
School.hasMany(SchoolContact, { foreignKey: 'school_id', as: 'contacts' });
SchoolContact.belongsTo(School, { foreignKey: 'school_id' });

// School <-> Zone
School.belongsTo(ZoneMaster, { foreignKey: 'zone_id', as: 'zone' });
ZoneMaster.hasMany(School, { foreignKey: 'zone_id' });

// School <-> Brand
School.belongsTo(BrandMaster, { foreignKey: 'brand_id', as: 'brand' });
BrandMaster.hasMany(School, { foreignKey: 'brand_id' });

// Enquiry <-> Sibling
SchoolEnquiry.hasMany(SchoolEnquirySibling, { foreignKey: 'enquiry_id', as: 'siblings' });
SchoolEnquirySibling.belongsTo(SchoolEnquiry, { foreignKey: 'enquiry_id' });

// Enquiry <-> Followup
SchoolEnquiry.hasMany(SchoolEnquiryFollowup, { foreignKey: 'enquiry_id', as: 'followups' });
SchoolEnquiryFollowup.belongsTo(SchoolEnquiry, { foreignKey: 'enquiry_id' });

// Followup <-> Masters
SchoolEnquiryFollowup.belongsTo(InteractionMaster, { foreignKey: 'interaction_mode_id', as: 'interaction_mode' });
SchoolEnquiryFollowup.belongsTo(PriorityMaster, { foreignKey: 'priority_id', as: 'priority_ref' });
SchoolEnquiryFollowup.belongsTo(StageMaster, { foreignKey: 'stage_id', as: 'stage' });
SchoolEnquiryFollowup.belongsTo(FollowupStatusMaster, { foreignKey: 'interaction_status_id', as: 'interaction_status' });
SchoolEnquiryFollowup.belongsTo(FollowupStatusMaster, { foreignKey: 'followup_status_id', as: 'followup_status_ref' });
SchoolEnquiryFollowup.belongsTo(User, { foreignKey: 'counsellor_id', as: 'counsellor' });

// Enquiry <-> School
SchoolEnquiry.belongsTo(School, { foreignKey: 'school_id', as: 'school' });
School.hasMany(SchoolEnquiry, { foreignKey: 'school_id' });

// Enquiry <-> Grade
SchoolEnquiry.belongsTo(GradeMaster, { foreignKey: 'grade_id', as: 'grade' });
GradeMaster.hasMany(SchoolEnquiry, { foreignKey: 'grade_id' });

// Admission Inquiry <-> School
AdmissionInquiry.belongsTo(School, { foreignKey: 'school_id', as: 'school_ref' });
School.hasMany(AdmissionInquiry, { foreignKey: 'school_id' });

AdmissionInquiry.belongsTo(GradeMaster, { foreignKey: 'grade_id', as: 'grade_ref' });
GradeMaster.hasMany(AdmissionInquiry, { foreignKey: 'grade_id' });

// Admission Inquiry <-> Source
AdmissionInquiry.belongsTo(SourceMaster, { foreignKey: 'source_id', as: 'source_ref' });
SourceMaster.hasMany(AdmissionInquiry, { foreignKey: 'source_id' });

// Admission Inquiry <-> Counsellor (Assigned To)
AdmissionInquiry.belongsTo(User, { foreignKey: 'assigned_to', as: 'counsellor' });
User.hasMany(AdmissionInquiry, { foreignKey: 'assigned_to' });

// Enquiry <-> Source
SchoolEnquiry.belongsTo(SourceMaster, { foreignKey: 'source_id', as: 'source_ref' });
SourceMaster.hasMany(SchoolEnquiry, { foreignKey: 'source_id' });

// Student Admissions Associations
StudentAdmissions.belongsTo(School, { foreignKey: 'school_id', as: 'school' });
School.hasMany(StudentAdmissions, { foreignKey: 'school_id' });

StudentAdmissions.belongsTo(GenderMaster, { foreignKey: 'gender_id', as: 'gender' });
GenderMaster.hasMany(StudentAdmissions, { foreignKey: 'gender_id' });

StudentAdmissions.belongsTo(GradeMaster, { foreignKey: 'grade_applying_for_id', as: 'grade_applying_for' });
StudentAdmissions.belongsTo(GradeMaster, { foreignKey: 'grade_id', as: 'grade' });
GradeMaster.hasMany(StudentAdmissions, { foreignKey: 'grade_applying_for_id' });
GradeMaster.hasMany(StudentAdmissions, { foreignKey: 'grade_id' });

StudentAdmissions.belongsTo(BoardMaster, { foreignKey: 'board_id', as: 'board' });
BoardMaster.hasMany(StudentAdmissions, { foreignKey: 'board_id' });

StudentAdmissions.belongsTo(ModeOfPaymentMaster, { foreignKey: 'payment_mode_id', as: 'payment_mode' });
ModeOfPaymentMaster.hasMany(StudentAdmissions, { foreignKey: 'payment_mode_id' });

StudentAdmissions.belongsTo(AcademicYearMaster, { foreignKey: 'academic_year_id', as: 'academic_year' });
AcademicYearMaster.hasMany(StudentAdmissions, { foreignKey: 'academic_year_id' });

StudentAdmissions.belongsTo(BloodGroupMaster, { foreignKey: 'blood_group_id', as: 'blood_group' });
BloodGroupMaster.hasMany(StudentAdmissions, { foreignKey: 'blood_group_id' });

StudentAdmissions.belongsTo(ReligionMaster, { foreignKey: 'religion_id', as: 'religion' });
ReligionMaster.hasMany(StudentAdmissions, { foreignKey: 'religion_id' });

StudentAdmissions.belongsTo(CastMaster, { foreignKey: 'cast_id', as: 'cast' });
CastMaster.hasMany(StudentAdmissions, { foreignKey: 'cast_id' });

StudentAdmissions.belongsTo(MotherTongueMaster, { foreignKey: 'mother_tongue_id', as: 'mother_tongue' });
MotherTongueMaster.hasMany(StudentAdmissions, { foreignKey: 'mother_tongue_id' });

StudentAdmissions.belongsTo(SchoolEnquiry, { foreignKey: 'enquiry_no', targetKey: 'enquiry_no', as: 'enquiry' });
SchoolEnquiry.hasOne(StudentAdmissions, { foreignKey: 'enquiry_no', sourceKey: 'enquiry_no' });

module.exports = {
  sequelize,
  User,
  School,
  SchoolPartner,
  SchoolContact,
  ZoneMaster,
  BrandMaster,
  GradeMaster,
  BoardMaster,
  SessionMaster,
  SchoolEnquiry,
  SchoolEnquirySibling,
  SchoolEnquiryFollowup,
  AdmissionInquiry,
  StudentAdmissions,
  PaymentEntityMaster,
  PasswordReset,
  InteractionMaster,
  PriorityMaster,
  StageMaster,
  FollowupStatusMaster,
  SourceMaster,
};
