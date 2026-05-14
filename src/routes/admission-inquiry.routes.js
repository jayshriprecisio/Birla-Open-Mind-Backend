const express = require('express');
const validate = require('../middleware/validate.middleware');
const validation = require('../validation/admission-inquiry.validation');
const controller = require('../controller/admission-inquiry.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', auth, (req, res, next) => {
  if (req.query.phone) return controller.getAdmissionInquiryByPhoneController(req, res, next);
  return validate(validation.listQuerySchema)(req, res, next);
}, controller.listAdmissionInquiriesController);

router.post('/', validate(validation.createAdmissionInquirySchema), controller.createAdmissionInquiryController);
router.patch('/:id/status', auth, validate(validation.updateStatusSchema), controller.updateAdmissionInquiryStatusController);
router.delete('/:id', auth, controller.softDeleteAdmissionInquiryController);

module.exports = router;
