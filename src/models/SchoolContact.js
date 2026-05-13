const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SchoolContact = sequelize.define('SchoolContact', {
  contact_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  contact_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email_login_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'school_contacts',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SchoolContact;
