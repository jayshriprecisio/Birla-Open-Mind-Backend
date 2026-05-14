const express = require('express');
const validate = require('../middleware/validate.middleware');
const validation = require('../validation/school.validation');
const controller = require('../controller/school.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(validation.createSchoolBodySchema), controller.createSchoolController)
  .get(auth, validate(validation.listSchoolsQuerySchema), controller.listSchoolsController);

router.get('/dashboard-summary', auth, controller.getSchoolsDashboardSummaryController);

router
  .route('/:schoolId')
  .get(auth, validate(validation.schoolIdParamSchema), controller.getSchoolByIdController)
  .put(auth, validate(validation.schoolIdParamSchema), validate(validation.updateSchoolBodySchema), controller.updateSchoolController)
  .delete(auth, validate(validation.schoolIdParamSchema), controller.softDeleteSchoolController);

router.patch('/:schoolId/status', auth, validate(validation.patchSchoolStatusSchema), controller.patchSchoolStatusController);

router.get('/dropdown', auth, controller.getSchoolDropdownController);

module.exports = router;
