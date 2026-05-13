const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ZoneMaster = sequelize.define('ZoneMaster', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  zone_name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
}, {
  tableName: 'zone_master',
  timestamps: false,
  underscored: true,
});

module.exports = ZoneMaster;
