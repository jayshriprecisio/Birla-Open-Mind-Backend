const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const authValidation = require('./auth.validation');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/login', validate(authValidation.loginSchema), authController.loginController);

module.exports = router;
