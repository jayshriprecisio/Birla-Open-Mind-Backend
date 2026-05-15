const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PriorityMaster = sequelize.define('PriorityMaster', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  color_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'ACTIVE',
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'priority_masters',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PriorityMaster;
