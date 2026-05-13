const express = require('express');
const validate = require('../middleware/validate.middleware');
const validation = require('../validation/auth.validation');
const controller = require('../controller/auth.controller');

const router = express.Router();

router.post('/login', validate(validation.loginSchema), controller.login);

module.exports = router;
