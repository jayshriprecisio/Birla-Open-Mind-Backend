const express = require('express');
const router = express.Router();
const uploadController = require('../controller/upload.controller');
const uploadMiddleware = require('../middleware/upload.middleware');

// Upload single file
router.post('/single', uploadMiddleware.single('file'), uploadController.uploadSingle);

// Upload multiple files (max 10)
router.post('/multiple', uploadMiddleware.array('files', 10), uploadController.uploadMultiple);

module.exports = router;
