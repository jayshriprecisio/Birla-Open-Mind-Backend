const Joi = require('joi');

const createFollowupSchema = {
  body: Joi.object({
    enquiry_id: Joi.string().uuid().required(),
    followup_date: Joi.date().required(),
    followup_time: Joi.string().required(),
    interaction_mode_id: Joi.number().integer().required(),
    priority_id: Joi.number().integer().required(),
    stage_id: Joi.number().integer().required(),
    followup_status_id: Joi.number().integer().required(),
    counsellor_id: Joi.number().integer().required(),
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
    priority_id: Joi.number().integer().optional(),
    stage_id: Joi.number().integer().optional(),
    followup_status_id: Joi.number().integer().optional(),
    counsellor_id: Joi.number().integer().optional(),
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
