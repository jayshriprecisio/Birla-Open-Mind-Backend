const sequelize = require('../config/database');
const User = require('./User');
const School = require('./School');
const SchoolPartner = require('./SchoolPartner');
const SchoolContact = require('./SchoolContact');
const masters = require('./masters.model');
const { ZoneMaster, BrandMaster, GradeMaster, PaymentEntityMaster, BoardMaster } = masters;
const SchoolEnquiry = require('./SchoolEnquiry');
const SchoolEnquirySibling = require('./SchoolEnquirySibling');
const SchoolEnquiryFollowup = require('./SchoolEnquiryFollowup');
const AdmissionInquiry = require('./AdmissionInquiry');
const StudentAdmissions = require('./StudentAdmissions');

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

// Student Admissions Associations
StudentAdmissions.belongsTo(School, { foreignKey: 'school_id', as: 'school' });
School.hasMany(StudentAdmissions, { foreignKey: 'school_id' });

StudentAdmissions.belongsTo(GradeMaster, { foreignKey: 'grade_applying_for_id', as: 'grade_applying_for' });
StudentAdmissions.belongsTo(GradeMaster, { foreignKey: 'grade_id', as: 'grade' });
GradeMaster.hasMany(StudentAdmissions, { foreignKey: 'grade_applying_for_id' });
GradeMaster.hasMany(StudentAdmissions, { foreignKey: 'grade_id' });

StudentAdmissions.belongsTo(BoardMaster, { foreignKey: 'board_id', as: 'board' });
BoardMaster.hasMany(StudentAdmissions, { foreignKey: 'board_id' });

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
  SchoolEnquiry,
  SchoolEnquirySibling,
  SchoolEnquiryFollowup,
  AdmissionInquiry,
  StudentAdmissions,
  PaymentEntityMaster,
};
