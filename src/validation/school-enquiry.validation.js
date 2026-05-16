const Joi = require('joi');

const siblingSchema = Joi.object({
  sibling_name: Joi.string().max(255).optional().allow(''),
  enrollment_no: Joi.string().max(255).optional().allow(''),
  dob: Joi.string().optional().allow(''),
  school_name: Joi.string().max(255).optional().allow(''),
  grade_id: Joi.number().integer().optional(),
  board_id: Joi.number().integer().optional(),
});

const followupSchema = Joi.object({
  interaction_mode_id: Joi.number().integer().optional(),
  interaction_status_id: Joi.number().integer().optional(),
  followup_date: Joi.string().optional().allow(''),
  followup_time: Joi.string().max(20).optional().allow(''),
  next_followup_date: Joi.string().optional().allow(''),
  next_followup_time: Joi.string().max(20).optional().allow(''),
  remarks: Joi.string().max(4000).optional().allow(''),
  notes: Joi.string().max(4000).optional().allow(''),
  followup_with: Joi.string().max(20).optional().allow(''),
});

const createEnquirySchema = {
  body: Joi.object({
    school_id: Joi.string().uuid().optional(),
    branch_id: Joi.number().integer().optional(),
    
    enquiry_purpose_id: Joi.number().integer().optional(),
    enquiry_for_id: Joi.number().integer().optional(),
    academic_session_id: Joi.number().integer().optional(),
    board_id: Joi.number().integer().optional(),
    grade_id: Joi.number().integer().optional(),
    batch_id: Joi.number().integer().optional(),
    school_type_id: Joi.number().integer().optional(),
    source_id: Joi.number().integer().optional(),
    sub_source_id: Joi.number().integer().optional(),
    lead_stage_id: Joi.number().integer().optional(),
    contact_mode_id: Joi.number().integer().optional(),

    student_name: Joi.string().max(255).required(),
    dob: Joi.string().optional().allow(''),
    gender_id: Joi.number().integer().optional(),
    aadhaar_no: Joi.string().max(20).optional().allow(''),
    current_school: Joi.string().max(255).optional().allow(''),
    current_board_id: Joi.number().integer().optional(),
    current_grade_id: Joi.number().integer().optional(),

    father_name: Joi.string().max(255).optional().allow(''),
    father_mobile: Joi.string().max(20).optional().allow(''),
    father_email: Joi.string().max(255).optional().allow(''),
    mother_name: Joi.string().max(255).optional().allow(''),
    mother_mobile: Joi.string().max(20).optional().allow(''),
    mother_email: Joi.string().max(255).optional().allow(''),
    guardian_name: Joi.string().max(255).optional().allow(''),
    guardian_mobile: Joi.string().max(20).optional().allow(''),
    preferred_contact_id: Joi.number().integer().optional(),

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
    
    interaction_mode_id: Joi.number().integer().optional(),
    interaction_status_id: Joi.number().integer().optional(),
    next_followup_date: Joi.string().optional().allow(''),
    priority_tag: Joi.string().max(20).optional().allow(''),
    status: Joi.string().max(50).optional().allow(''),
    
    siblings: Joi.array().items(siblingSchema).default([]),
    followup: followupSchema.optional(),
    utm_source: Joi.string().optional().allow(''),
    utm_medium: Joi.string().optional().allow(''),
  }).unknown(true) // Allow other fields to avoid breaking if frontend sends more
};

const phoneLookupSchema = {
  query: Joi.object({
    phone: Joi.string().min(10).max(20).required(),
  }).unknown(true)
};

const listSchoolEnquiriesQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(120).optional().allow(''),
    status: Joi.string().max(50).optional().allow(''),
    priority: Joi.string().max(20).optional().allow(''),
    stage: Joi.string().max(30).optional().allow(''),
    source: Joi.string().max(30).optional().allow(''),
    school: Joi.string().max(255).optional().allow(''),
    grade: Joi.string().max(100).optional().allow(''),
    counsellor: Joi.string().max(255).optional().allow(''),
    dateFrom: Joi.string().max(20).optional().allow(''),
    dateTo: Joi.string().max(20).optional().allow(''),
  }).unknown(true)
};

const updateEnquiryStatusSchema = {
  body: Joi.object({
    enquiry_id: Joi.string().uuid().required(),
    status: Joi.string().min(1).max(50).required(),
  }).unknown(true)
};

const deleteEnquirySchema = {
  query: Joi.object({
    enquiry_id: Joi.string().uuid().required(),
  }).unknown(true)
};

module.exports = {
  createEnquirySchema,
  phoneLookupSchema,
  listSchoolEnquiriesQuerySchema,
  updateEnquiryStatusSchema,
  deleteEnquirySchema,
};
