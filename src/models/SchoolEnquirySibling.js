const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SchoolEnquirySibling = sequelize.define('SchoolEnquirySibling', {
  sibling_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  enquiry_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sibling_name: { type: DataTypes.STRING(255) },
  enrollment_no: { type: DataTypes.STRING(255) },
  dob: { type: DataTypes.DATEONLY },
  school_name: { type: DataTypes.STRING(255) },
  grade_id: { type: DataTypes.INTEGER },
  board_id: { type: DataTypes.INTEGER },
}, {
  tableName: 'school_enquiry_siblings',
  timestamps: false,
  underscored: true,
});

module.exports = SchoolEnquirySibling;
