const Joi = require('joi');

const listQuerySchema = {
  query: Joi.object().keys({
    q: Joi.string().optional().allow(''),
    status: Joi.string().default('ALL'),
    school_id: Joi.string().optional(),
    grade_applying_for_id: Joi.string().optional(),
    grade_id: Joi.string().optional(),
    academic_session_id: Joi.string().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

const createAdmissionSchema = {
  body: Joi.object().keys({
    enquiry_no: Joi.string().optional().allow(''),
    academic_session_id: Joi.number().required(),
    school_id: Joi.string().uuid().required(),
    grade_applying_for_id: Joi.number().required(),
    grade_id: Joi.number().optional().allow(null),
    board_id: Joi.number().optional().allow(null),

    student_name: Joi.string().required(),
    dob: Joi.date().required(),
    gender_id: Joi.number().required(),
    blood_group_id: Joi.number().optional().allow(null),
    nationality: Joi.string().optional().allow(''),
    religion_id: Joi.number().optional().allow(null),
    category_id: Joi.number().optional().allow(null),
    mother_tongue: Joi.string().optional().allow(''),
    place_of_birth: Joi.string().optional().allow(''),
    prev_school_tc_no: Joi.string().optional().allow(''),
    prev_school_leaving_date: Joi.date().optional().allow(null),
    prev_class_passed: Joi.string().optional().allow(''),
    prev_class_percentage: Joi.string().optional().allow(''),

    father_name: Joi.string().optional().allow(''),
    father_mobile: Joi.string().optional().allow(''),
    father_email: Joi.string().email().optional().allow(''),
    father_occupation: Joi.string().optional().allow(''),
    father_aadhar_no: Joi.string().optional().allow(''),
    father_pan_no: Joi.string().optional().allow(''),
    
    father_employer_name: Joi.string().optional().allow(''),
    father_designation: Joi.string().optional().allow(''),
    father_annual_income: Joi.string().optional().allow(''),
    father_employer_address: Joi.string().optional().allow(''),
    father_employer_city: Joi.string().optional().allow(''),
    father_employer_state: Joi.string().optional().allow(''),
    father_employer_pincode: Joi.string().optional().allow(''),
    father_employer_country: Joi.string().optional().allow(''),

    mother_name: Joi.string().optional().allow(''),
    mother_mobile: Joi.string().optional().allow(''),
    mother_email: Joi.string().email().optional().allow(''),
    mother_occupation: Joi.string().optional().allow(''),
    mother_aadhar_no: Joi.string().optional().allow(''),
    mother_pan_no: Joi.string().optional().allow(''),

    mother_employer_name: Joi.string().optional().allow(''),
    mother_designation: Joi.string().optional().allow(''),
    mother_annual_income: Joi.string().optional().allow(''),
    mother_employer_address: Joi.string().optional().allow(''),
    mother_employer_city: Joi.string().optional().allow(''),
    mother_employer_state: Joi.string().optional().allow(''),
    mother_employer_pincode: Joi.string().optional().allow(''),
    mother_employer_country: Joi.string().optional().allow(''),

    guardian_name: Joi.string().optional().allow(''),
    guardian_mobile: Joi.string().optional().allow(''),
    guardian_email: Joi.string().email().optional().allow(''),
    guardian_relation: Joi.string().optional().allow(''),
    guardian_aadhar_no: Joi.string().optional().allow(''),
    guardian_pan_no: Joi.string().optional().allow(''),

    address: Joi.string().optional().allow(''),
    city: Joi.string().optional().allow(''),
    state: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
    pincode: Joi.string().optional().allow(''),

    admission_no: Joi.string().optional().allow(''),
    medical_conditions: Joi.string().optional().allow(''),
    emergency_contact: Joi.string().optional().allow(''),
    custody_situation: Joi.string().optional().allow(''),
  }),
};

const updateAdmissionSchema = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    // Same as create but all optional
    enquiry_no: Joi.string().optional().allow(''),
    academic_session_id: Joi.number().optional(),
    school_id: Joi.string().uuid().optional(),
    grade_applying_for_id: Joi.number().optional(),
    grade_id: Joi.number().optional().allow(null),
    board_id: Joi.number().optional().allow(null),
    student_name: Joi.string().optional(),
    dob: Joi.date().optional(),
    gender_id: Joi.number().optional(),
    blood_group: Joi.string().optional().allow(''),
    status: Joi.string().optional(),
    // ... add other fields as needed
  }).min(1),
};

const deleteAdmissionSchema = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

module.exports = {
  listQuerySchema,
  createAdmissionSchema,
  updateAdmissionSchema,
  deleteAdmissionSchema,
};
