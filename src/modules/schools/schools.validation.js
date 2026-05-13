const Joi = require('joi');

const createSchool = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    address: Joi.string().allow(''),
  }),
};

const getSchools = {
  query: Joi.object().keys({
    name: Joi.string(),
    code: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSchool = {
  params: Joi.object().keys({
    schoolId: Joi.number().integer().required(),
  }),
};

const updateSchool = {
  params: Joi.object().keys({
    schoolId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      code: Joi.string(),
      address: Joi.string(),
    })
    .min(1),
};

const deleteSchool = {
  params: Joi.object().keys({
    schoolId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool,
};
