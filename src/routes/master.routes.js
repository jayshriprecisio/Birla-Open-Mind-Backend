const express = require('express');
const masterController = require('../controller/master.controller');
const validate = require('../middleware/validate.middleware');
const { masterSchema, updateMasterSchema } = require('../validation/master.validation');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Publicly accessible list (optional, or keep under auth if required)
// router.use(auth); // Uncomment if authentication is required for all master routes

/**
 * Route: /api/v1/masters/:type
 * Valid types: interaction, priority, stage, followup-status
 */

router.route('/:type')
  .get(masterController.listMasters)
  .post(validate(masterSchema), masterController.createMaster);

router.route('/:type/:id')
  .get(masterController.getMaster)
  .patch(validate(updateMasterSchema), masterController.updateMaster)
  .delete(masterController.deleteMaster);

module.exports = router;
