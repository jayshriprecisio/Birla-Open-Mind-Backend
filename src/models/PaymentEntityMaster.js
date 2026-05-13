const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentEntityMaster = sequelize.define('PaymentEntityMaster', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  entity_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'active',
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_by: {
    type: DataTypes.STRING(50),
  },
  updated_by: {
    type: DataTypes.STRING(50),
  },
}, {
  tableName: 'payment_entity_master',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = PaymentEntityMaster;
