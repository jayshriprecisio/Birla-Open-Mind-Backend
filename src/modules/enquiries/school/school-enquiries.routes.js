const express = require('express');
const validate = require('../../../middlewares/validate.middleware');
const validation = require('./school-enquiries.validation');
const controller = require('./school-enquiries.controller');
const auth = require('../../../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(validation.createEnquirySchema), controller.createSchoolEnquiryController)
  .get(auth, validate(validation.listSchoolEnquiriesQuerySchema), controller.listSchoolEnquiriesController)
  .put(auth, validate(validation.updateEnquiryStatusSchema), controller.updateSchoolEnquiryStatusController)
  .delete(auth, validate(validation.deleteEnquirySchema), controller.deleteSchoolEnquiryController);

router
  .route('/phone-lookup')
  .get(auth, validate(validation.phoneLookupSchema), controller.admissionInquiryByPhoneController);

module.exports = router;
