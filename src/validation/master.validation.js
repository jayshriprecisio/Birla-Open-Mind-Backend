const Joi = require('joi');

const masterSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow(null, ''),
  display_order: Joi.number().integer().min(0).default(0),
  color_code: Joi.string().max(20).allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
});

const updateMasterSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().allow(null, ''),
  display_order: Joi.number().integer().min(0),
  color_code: Joi.string().max(20).allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1);

module.exports = {
  masterSchema,
  updateMasterSchema,
};
