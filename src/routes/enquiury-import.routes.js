
const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth.middleware');

const upload = require('../middleware/upload.middleware');

const controller = require('../controller/enquiry-import.controller');

router.post(
  '/upload',

  auth,

  upload.single('file'),

  controller.uploadEnquiryFileController
);

module.exports = router;




