
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

router.get(
  '/:batchId/preview',
  auth,
  controller.previewEnquiryImportController
);

router.post(
  '/:batchId/import',
  auth,
  controller.importEnquiryBatchController
);

module.exports = router;




