const express = require('express');
const validate = require('../middleware/validate.middleware');
const validation = require('../validation/school-enquiry-followup.validation');
const controller = require('../controller/school-enquiry-followup.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(validation.createFollowupSchema), controller.createFollowupController)
  .get(auth, validate(validation.listFollowupsQuerySchema), controller.listFollowupsController);

router
  .route('/:id')
  .get(auth, controller.getFollowupByIdController)
  .put(auth, validate(validation.updateFollowupSchema), controller.updateFollowupController)
  .delete(auth, controller.deleteFollowupController);

router
  .route('/enquiry-details/:enquiry_no')
  .get(auth, validate(validation.enquiryLookupSchema), controller.findEnquiryByNoController);

module.exports = router;
