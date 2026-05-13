const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GradeMaster = sequelize.define('GradeMaster', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING(255) },
  short_form: { type: DataTypes.STRING(20) },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'grade_master',
  timestamps: false,
  underscored: true,
});

module.exports = GradeMaster;
