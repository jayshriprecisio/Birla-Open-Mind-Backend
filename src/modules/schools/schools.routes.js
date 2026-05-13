const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const validation = require('./schools.validation');
const controller = require('./schools.controller');
const auth = require('../../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(validation.createSchoolBodySchema), controller.createSchoolController)
  .get(auth, validate(validation.listSchoolsQuerySchema), controller.listSchoolsController);

router
  .route('/summary')
  .get(auth, controller.getSchoolsDashboardSummaryController);

router
  .route('/:schoolId')
  .get(auth, validate(validation.schoolIdParamSchema), controller.getSchoolByIdController)
  .put(auth, validate(validation.schoolIdParamSchema), validate(validation.updateSchoolBodySchema), controller.updateSchoolController)
  .delete(auth, validate(validation.schoolIdParamSchema), controller.softDeleteSchoolController);

router
  .route('/:schoolId/status')
  .patch(auth, validate(validation.schoolIdParamSchema), validate(validation.patchSchoolStatusSchema), controller.patchSchoolStatusController);

module.exports = router;
