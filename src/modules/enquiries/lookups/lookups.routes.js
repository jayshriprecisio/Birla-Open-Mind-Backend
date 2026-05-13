const express = require('express');
const lookupsController = require('./lookups.controller');

const router = express.Router();

router.get('/schools', lookupsController.listSchoolsController);
router.get('/grades', lookupsController.listGradesController);

module.exports = router;
