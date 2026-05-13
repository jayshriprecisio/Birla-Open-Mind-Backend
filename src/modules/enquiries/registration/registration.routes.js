const express = require('express');
const auth = require('../../../middlewares/auth.middleware');
const controller = require('./registration.controller');

const router = express.Router();

router.get('/search', auth, controller.searchRegistrationsController);

router.get('/', auth, controller.listRegistrationsController);

router.get('/:enquiryId', auth, controller.getRegistrationByIdController);

module.exports = router;
