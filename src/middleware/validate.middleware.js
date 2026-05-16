const Joi = require('joi');
const ApiError = require('../utils/api-error');

const validate = (schema) => (req, res, next) => {
  if (!schema) {
    return next(new ApiError(500, `Internal Server Error: Validation schema is undefined for route ${req.originalUrl}`));
  }
  const validSchema = Object.keys(schema).reduce((acc, key) => {
    if (schema[key] && (key === 'body' || key === 'query' || key === 'params')) {
      acc[key] = schema[key];
    }
    return acc;
  }, {});

  const object = Object.keys(validSchema).reduce((acc, key) => {
    acc[key] = req[key] || {};
    return acc;
  }, {});

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .unknown(true)
    .validate(object);

  if (error) {
    console.log('Validation Error for:', req.originalUrl);
    console.log('Object being validated:', JSON.stringify(object, null, 2));
    console.log('Valid Schema keys:', Object.keys(validSchema));
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(400, errorMessage));
  }
  Object.keys(value).forEach((key) => {
    if (req[key] && value[key]) {
      Object.assign(req[key], value[key]);
    }
  });
  return next();
};

module.exports = validate;
