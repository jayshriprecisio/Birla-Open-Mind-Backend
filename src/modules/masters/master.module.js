const express = require('express');
const router = express.Router();
const masterController = require('./master.controller');
const validate = require('../../middleware/validate.middleware');
const { masterSchema, updateMasterSchema } = require('./master.validation');

/**
 * Centralized Master Module Routes
 * Supports CRUD for any master registered in master.registry.js
 */

router.route('/:masterType')
  .get(masterController.listMasters)
  .post(validate(masterSchema), masterController.createMaster);

router.route('/:masterType/:id')
  .get(masterController.getMaster)
  .patch(validate(updateMasterSchema), masterController.updateMaster)
  .delete(masterController.deleteMaster);

module.exports = router;
