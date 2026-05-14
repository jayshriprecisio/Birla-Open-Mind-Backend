const Joi = require('joi');

const createFollowupSchema = {
  body: Joi.object({
    enquiry_id: Joi.string().uuid().required(),
    followup_date: Joi.date().required(),
    followup_time: Joi.string().required(),
    interaction_mode_id: Joi.number().integer().required(),
    followup_by: Joi.string().uuid().optional(), // Assign Counsellor
    priority: Joi.string().max(20).optional(),
    remarks: Joi.string().max(4000).optional().allow(''),
    next_followup_date: Joi.date().optional(),
    next_followup_time: Joi.string().optional(),
  })
};

const updateFollowupSchema = {
  params: Joi.object({
    id: Joi.number().integer().required()
  }),
  body: Joi.object({
    followup_date: Joi.date().optional(),
    followup_time: Joi.string().optional(),
    interaction_mode_id: Joi.number().integer().optional(),
    followup_by: Joi.string().uuid().optional(),
    priority: Joi.string().max(20).optional(),
    remarks: Joi.string().max(4000).optional().allow(''),
    next_followup_date: Joi.date().optional(),
    next_followup_time: Joi.string().optional(),
  })
};

const listFollowupsQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    enquiry_id: Joi.string().uuid().optional(),
  })
};

const enquiryLookupSchema = {
  params: Joi.object({
    enquiry_no: Joi.string().required()
  })
};

module.exports = {
  createFollowupSchema,
  updateFollowupSchema,
  listFollowupsQuerySchema,
  enquiryLookupSchema,
};
