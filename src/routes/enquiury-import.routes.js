const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware.js');
const upload = require('../middleware/upload.middleware.js');
const controller = require('../controller/enquiry-import.controller.js')

router.post('/upload', auth, upload.single('file'), controller.uploadEnquiryFileController);


module.exports = router;






