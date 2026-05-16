const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdmissionInquiry = sequelize.define('AdmissionInquiry', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  school_id: { type: DataTypes.UUID },
  grade_id: { type: DataTypes.BIGINT },

  phone_number: { type: DataTypes.STRING(20) },

  parent_first_name: { type: DataTypes.STRING(255) },
  parent_last_name: { type: DataTypes.STRING(255) },


  relationship_with_student: {
    type: DataTypes.STRING(100),
  },

  email: { type: DataTypes.STRING(255) },

  counsellor_name: {
    type: DataTypes.STRING(255),
  },
  source_id: {
    type: DataTypes.BIGINT,
  },

  comment: { type: DataTypes.TEXT },

  status: { type: DataTypes.STRING(50), defaultValue: 'NEW' },
  source_id: { type: DataTypes.BIGINT },
  assigned_to: { type: DataTypes.BIGINT },

  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE },
  deleted_by: { type: DataTypes.BIGINT },
}, {
  tableName: 'admission_inquiry',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = AdmissionInquiry;
