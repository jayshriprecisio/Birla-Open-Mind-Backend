const express = require('express');
const controller = require('../controller/lookup.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/schools', controller.listSchoolsLookupController);
router.get('/grades', controller.listGradesLookupController);

module.exports = router;
