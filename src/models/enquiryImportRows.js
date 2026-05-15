const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnquiryImportRow = sequelize.define('EnquiryImportRow', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  batch_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  row_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  grade_name: {
    type: DataTypes.STRING(100),
  },

  grade_id: {
    type: DataTypes.BIGINT,
  },

  parent_first_name: {
    type: DataTypes.STRING(255),
  },

  parent_last_name: {
    type: DataTypes.STRING(255),
  },

  relationship_with_student: {
    type: DataTypes.STRING(100),
  },

  email: {
    type: DataTypes.STRING(255),
  },

  phone_number: {
    type: DataTypes.STRING(20),
  },

  source: {
    type: DataTypes.STRING(100),
    defaultValue: 'Imported'
  },

  counsellor_name: {
    type: DataTypes.STRING(255),
  },

  comment: {
    type: DataTypes.TEXT,
  },

  validation_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'PENDING',
  },

  validation_errors: {
    type: DataTypes.JSONB,
  },

  is_duplicate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  is_imported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  imported_enquiry_id: {
    type: DataTypes.BIGINT,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW,
},
}, {
  tableName: 'enquiry_import_rows',
  timestamps: false,
  underscored: true,
});

module.exports = EnquiryImportRow;