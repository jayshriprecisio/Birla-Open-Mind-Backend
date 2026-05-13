const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const schoolValidation = require('./schools.validation');
const schoolController = require('./schools.controller');
const auth = require('../../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(schoolValidation.createSchool), schoolController.createSchool)
  .get(auth, validate(schoolValidation.getSchools), schoolController.getSchools);

router
  .route('/:schoolId')
  .get(auth, validate(schoolValidation.getSchool), schoolController.getSchool)
  .put(auth, validate(schoolValidation.updateSchool), schoolController.updateSchool)
  .delete(auth, validate(schoolValidation.deleteSchool), schoolController.deleteSchool);

module.exports = router;
