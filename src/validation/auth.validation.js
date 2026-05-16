const Joi = require('joi');

const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
};

const resetPasswordSchema = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }).unknown(true),
};

const forgotPasswordSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }).unknown(true),
};

module.exports = {
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
