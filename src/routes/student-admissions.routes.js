const express = require("express");
const validate = require("../middleware/validate.middleware");
const validation = require("../validation/student-admissions.validation");
const controller = require("../controller/student-admissions.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  auth,
  validate(validation.createAdmissionSchema),
  controller.createAdmissionController,
);
router.get(
  "/",
  auth,
  validate(validation.listQuerySchema),
  controller.getAllAdmissionsController,
);
router.get("/stats", auth, controller.getAdmissionStatsController);
router.get("/:id", auth, controller.getAdmissionByIdController);
router.patch(
  "/:id",
  auth,
  validate(validation.updateAdmissionSchema),
  controller.updateAdmissionController,
);
router.delete(
  "/:id",
  auth,
  validate(validation.deleteAdmissionSchema),
  controller.deleteAdmissionController,
);

router.patch(
  "/cancel/:id",
  auth,
  validate(validation.cancelAdmissionSchema),
  controller.cancelAdmissionController,
);

module.exports = router;
