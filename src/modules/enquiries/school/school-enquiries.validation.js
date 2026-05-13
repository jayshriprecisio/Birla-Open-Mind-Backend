const Joi = require('joi');

const createEnquirySchema = {
  body: Joi.object().keys({
    school_id: Joi.string().uuid().optional(),
    branch_id: Joi.number().integer().optional(),
    student_name: Joi.string().max(255).required(),
    dob: Joi.string().optional().allow(''),
    aadhaar_no: Joi.string().max(20).optional().allow(''),
    current_school: Joi.string().max(255).optional().allow(''),
    father_name: Joi.string().max(255).optional().allow(''),
    father_mobile: Joi.string().max(20).optional().allow(''),
    father_email: Joi.string().max(255).optional().allow(''),
    mother_name: Joi.string().max(255).optional().allow(''),
    mother_mobile: Joi.string().max(20).optional().allow(''),
    mother_email: Joi.string().max(255).optional().allow(''),
    guardian_name: Joi.string().max(255).optional().allow(''),
    guardian_mobile: Joi.string().max(20).optional().allow(''),
    address_line1: Joi.string().max(1000).optional().allow(''),
    address_line2: Joi.string().max(1000).optional().allow(''),
    address_line3: Joi.string().max(1000).optional().allow(''),
    pincode: Joi.string().max(10).optional().allow(''),
    country: Joi.string().max(50).optional().allow(''),
    state: Joi.string().max(50).optional().allow(''),
    city: Joi.string().max(50).optional().allow(''),
    is_concession: Joi.boolean().default(false),
    concession_type_id: Joi.number().integer().optional(),
    is_referral: Joi.boolean().default(false),
    referral_name: Joi.number().integer().optional(),
    next_followup_date: Joi.string().optional().allow(''),
    priority_tag: Joi.string().max(20).optional().allow(''),
    status: Joi.string().max(50).optional().allow(''),
    siblings: Joi.array().items(
      Joi.object().keys({
        sibling_name: Joi.string().max(255).optional().allow(''),
        enrollment_no: Joi.string().max(255).optional().allow(''),
        dob: Joi.string().optional().allow(''),
        school_name: Joi.string().max(255).optional().allow(''),
        grade_id: Joi.number().integer().optional(),
        board_id: Joi.number().integer().optional(),
      })
    ).default([]),
    followup: Joi.object().keys({
      interaction_mode_id: Joi.number().integer().optional(),
      interaction_status_id: Joi.number().integer().optional(),
      followup_date: Joi.string().optional().allow(''),
      followup_time: Joi.string().max(20).optional().allow(''),
      next_followup_date: Joi.string().optional().allow(''),
      next_followup_time: Joi.string().max(20).optional().allow(''),
      remarks: Joi.string().max(4000).optional().allow(''),
      notes: Joi.string().max(4000).optional().allow(''),
      followup_with: Joi.string().max(20).optional().allow(''),
    }).optional(),
  }),
};

const updateEnquiryStatusSchema = {
  params: Joi.object().keys({
    enquiryId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().min(1).max(50).required(),
  }),
};

const deleteEnquirySchema = {
  params: Joi.object().keys({
    enquiryId: Joi.string().uuid().required(),
  }),
};

module.exports = {
  createEnquirySchema,
  updateEnquiryStatusSchema,
  deleteEnquirySchema,
};
