const Joi = require('joi');

const listQuerySchema = {
  query: Joi.object().keys({
    q: Joi.string().optional().allow(''),
    status: Joi.string().default('ALL'),
    school: Joi.string().default('ALL'),
    grade: Joi.string().default('ALL'),
    dateFrom: Joi.string().optional().allow(''),
    dateTo: Joi.string().optional().allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

const updateStatusSchema = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().min(1).max(30).required(),
  }),
};

const deleteAdmissionInquiryParamSchema = {
  params: Joi.object().keys({
    id: Joi.string().regex(/^[1-9]\d{0,18}$/).required(),
  }),
};

const RELATION_VALUES = ['Father', 'Mother', 'Guardian'];

const createAdmissionInquirySchema = {
  body: Joi.object().keys({
    school: Joi.string().min(1).max(255).required(),
    grade: Joi.string().min(1).max(100).required(),
    parent_first_name: Joi.string().min(1).max(255).required(),
    parent_last_name: Joi.string().min(1).max(255).required(),
    relation: Joi.string().valid(...RELATION_VALUES).default('Father'),
    email: Joi.string().email().max(255).required(),
    phone_number: Joi.string().min(7).max(15).required(),
    comment: Joi.string().max(2000).optional().allow(''),
    captcha_token: Joi.string().min(1).max(2048).required(),
    captcha_answer: Joi.string().min(1).max(16).required(),
  }),
};

module.exports = {
  listQuerySchema,
  updateStatusSchema,
  deleteAdmissionInquiryParamSchema,
  createAdmissionInquirySchema,
};
