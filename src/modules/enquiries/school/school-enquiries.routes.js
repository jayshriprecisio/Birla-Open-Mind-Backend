const express = require('express');
const validate = require('../../../middlewares/validate.middleware');
const validation = require('./school-enquiries.validation');
const controller = require('./school-enquiries.controller');
const auth = require('../../../middlewares/auth.middleware'); // Protect these routes

const router = express.Router();

router
  .route('/')
  .post(auth, validate(validation.createEnquirySchema), controller.createSchoolEnquiryController)
  .get(auth, controller.listSchoolEnquiriesController);

router
  .route('/:enquiryId/status')
  .put(auth, validate(validation.updateEnquiryStatusSchema), controller.updateSchoolEnquiryStatusController);

router
  .route('/:enquiryId')
  .delete(auth, validate(validation.deleteEnquirySchema), controller.deleteSchoolEnquiryController);

module.exports = router;
