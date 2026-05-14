const express = require('express');
const controller = require('../controller/lookup.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/schools', controller.listSchoolsLookupController);
router.get('/grades', controller.listGradesLookupController);
router.get('/captcha', controller.getCaptchaController);
router.get('/enquiry-lookups', controller.getEnquiryLookupsController);
router.get('/school-form', controller.getSchoolFormLookupsController);

module.exports = router;
