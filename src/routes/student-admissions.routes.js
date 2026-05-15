const express = require("express");
const validate = require("../middleware/validate.middleware");
const validation = require("../validation/student-admissions.validation");
const controller = require("../controller/student-admissions.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/draft",
  auth,
  validate(validation.createDraftAdmissionSchema),
  controller.createDraftAdmissionController,
);

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
router.get(
  "/search",
  auth,
  validate(validation.searchAdmissionSchema),
  controller.getAdmissionBySearchController,
);
router.get("/:id", auth, controller.getAdmissionByIdController);

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

router.patch(
  "/clear-cheque/:id",
  auth,
  validate(validation.clearChequeSchema),
  controller.clearChequeController,
);

module.exports = router;
