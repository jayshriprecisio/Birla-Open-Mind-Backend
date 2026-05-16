const Joi = require('joi');

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
    utm_source: Joi.string().optional().allow(''),
    utm_medium: Joi.string().optional().allow(''),
  }).unknown(true),
};

const payload = {
    captcha_answer: "3377Q",
    captcha_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoiZmYzNWQ2MjNjODQ5ZTQzNTJiOTQ1NmRhZmZjYjAwMTJhOTc0NWUzYTBlNWE1MDQ5MDBhMTRjZWI1NTNmYWEzYyIsIm4iOiItYjVnOUhiNHlwdjVpNWFKIiwidCI6ImNhcHRjaGEiLCJpYXQiOjE3Nzg4NDgxNjcsImV4cCI6MTc3ODg0ODQ2N30.DtPw1pR6RJT1KHh-wssRx4Culvw2ob-H6kLZMc7pDxU",
    comment: "new",
    email: "p@gmail.com",
    grade: "LY 2",
    parent_first_name: "ham",
    parent_last_name: "pur",
    phone_number: "1212121212",
    relation: "Father",
    school: "New ideal english school",
    utm_medium: "",
    utm_source: ""
};

const schema = createAdmissionInquirySchema;
const validSchema = Object.keys(schema).reduce((acc, key) => {
    if (schema[key] && (key === 'body' || key === 'query' || key === 'params')) {
      acc[key] = schema[key];
    }
    return acc;
  }, {});

const object = {
    body: payload
};

const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

if (error) {
    console.log('Error:', error.details.map(d => d.message).join(', '));
} else {
    console.log('Success!');
}
