const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BrandMaster = sequelize.define('BrandMaster', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  brand_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'brand_master',
  timestamps: false,
  underscored: true,
});

module.exports = BrandMaster;
