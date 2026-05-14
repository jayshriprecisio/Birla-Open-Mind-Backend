const express = require('express');
const validate = require('../middleware/validate.middleware');
const validation = require('../validation/auth.validation');
const controller = require('../controller/auth.controller');

const router = express.Router();

router.post('/login', validate(validation.loginSchema), controller.login);
router.post('/logout', controller.logout);
router.post('/forgot-password', validate(validation.forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(validation.resetPasswordSchema), controller.resetPassword);

module.exports = router;
