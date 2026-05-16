const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
  school_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  brand_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  brand_code: {
    type: DataTypes.STRING(20),
  },
  school_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  school_code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  board: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  session_month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_capacity: {
    type: DataTypes.INTEGER,
  },
  operational_capacity: {
    type: DataTypes.INTEGER,
  },
  address_line1: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address_line2: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address_line3: {
    type: DataTypes.STRING(255),
  },
  pin_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(2),
    defaultValue: 'IN',
  },
  state_province: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  official_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  website_url: {
    type: DataTypes.STRING(512),
  },
  billing_name: {
    type: DataTypes.STRING(255),
  },
  billing_same_as_school: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  billing_address_line1: {
    type: DataTypes.STRING(255),
  },
  billing_address_line2: {
    type: DataTypes.STRING(255),
  },
  billing_address_line3: {
    type: DataTypes.STRING(255),
  },
  billing_pin_code: {
    type: DataTypes.STRING(10),
  },
  billing_country: {
    type: DataTypes.STRING(2),
  },
  billing_state_province: {
    type: DataTypes.STRING(60),
  },
  billing_city: {
    type: DataTypes.STRING(60),
  },
  affiliation_number: {
    type: DataTypes.STRING(30),
  },
  cbse_school_code: {
    type: DataTypes.STRING(20),
  },
  udise_code: {
    type: DataTypes.STRING(20),
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
  created_by: {
    type: DataTypes.BIGINT,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'schools',
  timestamps: true,
  paranoid: true, // This handles the deleted_at soft delete automatically
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = School;
