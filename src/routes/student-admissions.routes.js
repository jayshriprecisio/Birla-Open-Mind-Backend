const express = require('express');
const validate = require('../middleware/validate.middleware');
const validation = require('../validation/student-admissions.validation');
const controller = require('../controller/student-admissions.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', validate(validation.createAdmissionSchema), controller.createAdmissionController);
router.get('/', auth, validate(validation.listQuerySchema), controller.getAllAdmissionsController);
router.get('/:id', auth, controller.getAdmissionByIdController);
router.patch('/:id', auth, validate(validation.updateAdmissionSchema), controller.updateAdmissionController);
router.delete('/:id', auth, validate(validation.deleteAdmissionSchema), controller.deleteAdmissionController);

module.exports = router;
