const express = require('express');
const validate = require('../middleware/validate.middleware');
const validation = require('../validation/school-enquiry.validation');
const controller = require('../controller/school-enquiry.controller');
const auth = require('../middleware/auth.middleware');

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
