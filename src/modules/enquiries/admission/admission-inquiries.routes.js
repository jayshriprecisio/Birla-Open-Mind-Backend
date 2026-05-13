const express = require('express');
const validate = require('../../../middlewares/validate.middleware');
const validation = require('./admission-inquiries.validation');
const controller = require('./admission-inquiries.controller');
const auth = require('../../../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .post(validate(validation.createAdmissionInquirySchema), controller.createAdmissionInquiryController)
  .get(auth, validate(validation.listQuerySchema), controller.listAdmissionInquiriesController);

router
  .route('/:id/status')
  .put(auth, validate(validation.updateStatusSchema), controller.updateAdmissionInquiryStatusController);

router
  .route('/:id')
  .delete(auth, validate(validation.deleteAdmissionInquiryParamSchema), controller.deleteAdmissionInquiryController);

module.exports = router;
