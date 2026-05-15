const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FollowupStatusMaster = sequelize.define('FollowupStatusMaster', {
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
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'ACTIVE',
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'followup_status_masters',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FollowupStatusMaster;
