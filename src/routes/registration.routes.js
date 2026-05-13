const express = require('express');
const auth = require('../middleware/auth.middleware');
const controller = require('../controller/registration.controller');

const router = express.Router();

router.get('/search', auth, controller.searchRegistrationsController);

router.get('/', auth, controller.listRegistrationsController);

router.get('/:enquiryId', auth, controller.getRegistrationByIdController);

module.exports = router;
