const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SchoolPartner = sequelize.define('SchoolPartner', {
  partner_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  partner_name: {
    type: DataTypes.STRING(255),
  },
  partner_email: {
    type: DataTypes.STRING(255),
  },
  partner_mobile: {
    type: DataTypes.STRING(20),
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'school_partners',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = SchoolPartner;
