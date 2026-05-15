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
    .validate(object);

  if (error) {
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
