const Joi = require('joi');

const partnerRow = Joi.object({
  partner_name: Joi.string().optional().allow(''),
  partner_email: Joi.string().email().optional().allow(''),
  partner_mobile: Joi.string().optional().allow(''),
  sort_order: Joi.number().integer().min(0).optional(),
});

const contactRow = Joi.object({
  full_name: Joi.string().min(1).required(),
  email_login_id: Joi.string().email().required(),
  phone_number: Joi.string().min(1).required(),
});

const createSchoolBodySchema = {
  body: Joi.object({
    zone_id: Joi.number().integer().positive().required(),
    brand_id: Joi.number().integer().positive().required(),
    brand_code: Joi.string().max(20).optional().allow(''),
    school_name: Joi.string().min(1).max(255).required(),
    school_code: Joi.string().min(1).max(30).required(),
    board: Joi.string().min(1).max(30).required(),
    session_month: Joi.number().integer().min(1).max(12).required(),
    total_capacity: Joi.number().integer().positive().optional().allow(null),
    operational_capacity: Joi.number().integer().positive().optional().allow(null),
    address_line1: Joi.string().min(1).max(255).required(),
    address_line2: Joi.string().min(1).max(255).required(),
    address_line3: Joi.string().max(255).optional().allow('', null),
    pin_code: Joi.string().pattern(/^[0-9]{6}$/).required(),
    country: Joi.string().length(2).default('IN'),
    state_province: Joi.string().min(1).max(60).required(),
    city: Joi.string().min(1).max(60).required(),
    phone_number: Joi.string().min(1).max(15).required(),
    official_email: Joi.string().email().required(),
    website_url: Joi.string().max(512).optional().allow('', null),
    billing_name: Joi.string().max(255).optional().allow('', null),
    billing_same_as_school: Joi.boolean().default(false),
    billing_address_line1: Joi.string().max(255).optional().allow('', null),
    billing_address_line2: Joi.string().max(255).optional().allow('', null),
    billing_address_line3: Joi.string().max(255).optional().allow('', null),
    billing_pin_code: Joi.string().length(6).pattern(/^[0-9]{6}$/).optional().allow('', null),
    billing_country: Joi.string().length(2).optional().allow('', null),
    billing_state_province: Joi.string().max(60).optional().allow('', null),
    billing_city: Joi.string().max(60).optional().allow('', null),
    affiliation_number: Joi.string().max(30).optional().allow('', null),
    cbse_school_code: Joi.string().max(20).optional().allow('', null),
    udise_code: Joi.string().max(20).optional().allow('', null),
    status: Joi.string().valid('active', 'inactive', 'suspended').default('active'),
    partners: Joi.array().items(partnerRow).default([]),
    centre_head: contactRow.required(),
    principal: contactRow.optional().allow(null),
  })
  .custom((value, helpers) => {
    // Validation for billing
    if (!value.billing_same_as_school) {
      if (value.billing_name || value.billing_address_line1) {
        if (!value.billing_address_line1 || !value.billing_address_line2 || 
            !value.billing_pin_code || !value.billing_country || 
            !value.billing_state_province || !value.billing_city) {
          return helpers.message('When billing is not same as school, complete billing name and address fields.');
        }
      }
    }

    // Validation for principal
    const isBomps = (value.brand_code || '').trim().toUpperCase() === 'BOMPS';
    if (!isBomps) {
      const p = value.principal;
      if (!p || !p.full_name?.trim() || !p.email_login_id?.trim() || !p.phone_number?.trim()) {
        return helpers.message('Principal details are required for this brand.');
      }
    }
    return value;
  })
};

const updateSchoolBodySchema = createSchoolBodySchema;

const schoolIdParamSchema = {
  params: Joi.object({
    schoolId: Joi.string().uuid().required(),
  }),
};

const listSchoolsQuerySchema = {
  query: Joi.object({
    q: Joi.string().max(200).optional().allow(''),
    status: Joi.string().valid('all', 'active', 'inactive', 'suspended').default('all'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().valid('created_at', 'school_name', 'school_code', 'city').default('school_name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    zone: Joi.string().max(120).optional().allow(''),
    board: Joi.string().max(30).optional().allow(''),
    brand: Joi.string().valid('all', 'BOMIS', 'BOMPS').default('all'),
    mapping: Joi.string().valid('all', 'mapped', 'partial', 'unmapped').default('all'),
  }),
};

const patchSchoolStatusSchema = {
  params: Joi.object({
    schoolId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    status: Joi.string().valid('active', 'inactive', 'suspended').required(),
  }),
};

module.exports = {
  createSchoolBodySchema,
  updateSchoolBodySchema,
  schoolIdParamSchema,
  listSchoolsQuerySchema,
  patchSchoolStatusSchema,
};
