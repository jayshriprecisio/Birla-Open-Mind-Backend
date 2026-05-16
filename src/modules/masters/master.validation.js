const Joi = require('joi');

const masterSchema = Joi.object({
  name: Joi.string().max(150).required(),
  description: Joi.string().allow(null, ''),
  display_order: Joi.number().integer().min(0).default(0),
  color_code: Joi.string().max(20).allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
}).unknown(true); // Allow other fields for legacy masters

const updateMasterSchema = Joi.object({
  name: Joi.string().max(150),
  description: Joi.string().allow(null, ''),
  display_order: Joi.number().integer().min(0),
  color_code: Joi.string().max(20).allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1).unknown(true);

module.exports = {
  masterSchema,
  updateMasterSchema,
};
