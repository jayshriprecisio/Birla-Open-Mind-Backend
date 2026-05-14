const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SchoolEnquiryFollowup = sequelize.define('SchoolEnquiryFollowup', {
  followup_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  enquiry_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  interaction_mode_id: { type: DataTypes.INTEGER },
  interaction_status_id: { type: DataTypes.INTEGER },
  followup_date: { type: DataTypes.DATEONLY },
  followup_time: { type: DataTypes.TIME },
  next_followup_date: { type: DataTypes.DATEONLY },
  next_followup_time: { type: DataTypes.TIME },
  remarks: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  followup_with: { type: DataTypes.STRING(20) },
  followup_by: { type: DataTypes.UUID },
  priority: { type: DataTypes.STRING(20) },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_by: { type: DataTypes.UUID },
  updated_by: { type: DataTypes.UUID },
}, {
  tableName: 'school_enquiry_followups',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SchoolEnquiryFollowup;

