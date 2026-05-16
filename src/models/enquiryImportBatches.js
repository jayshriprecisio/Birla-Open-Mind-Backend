const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnquiryImportBatch = sequelize.define('EnquiryImportBatch', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  //foreign Key
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'schools',
      key: 'school_id',
    },
  },

  file_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  file_path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  total_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  valid_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  invalid_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  duplicate_rows: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  import_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'UPLOADED',
  },

  uploaded_by: {
    type: DataTypes.BIGINT,
  },

}, {
  tableName: 'enquiry_import_batches',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = EnquiryImportBatch;