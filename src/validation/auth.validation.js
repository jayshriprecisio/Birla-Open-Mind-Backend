const Joi = require('joi');

const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const resetPasswordSchema = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};

const forgotPasswordSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
