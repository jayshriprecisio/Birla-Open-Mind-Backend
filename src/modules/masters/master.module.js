const express = require('express');
const router = express.Router();
const masters = require('../../models/masters.model');
const { catchAsync } = require('../../utils/catchAsync'); // Assuming you have this helper

// --- Master Registry ---
const masterRegistry = {
  'academic-masters': masters.AcademicMaster,
  'academic-subjects': masters.AcademicSubjectMaster,
  'academic-years': masters.AcademicYearMaster,
  'batches': masters.BatchMaster,
  'boards': masters.BoardMaster,
  'brands': masters.BrandMaster,
  'calculation-basis': masters.CalculationBasisMaster,
  'cheque-favour': masters.ChequeFavourMaster,
  'courses': masters.CourseMaster,
  'divisions': masters.DivisionMaster,
  'fees-categories': masters.FeesCategoryMaster,
  'fees-sub-types': masters.FeesSubTypeMaster,
  'fees-types': masters.FeesTypeMaster,
  'genders': masters.GenderMaster,
  'grades': masters.GradeMaster,
  'houses': masters.HouseMaster,
  'payment-modes': masters.ModeOfPaymentMaster,
  'parameters': masters.ParameterMaster,
  'payment-entities': masters.PaymentEntityMaster,
  'pdc-statuses': masters.PdcStatusMaster,
  'service-periods': masters.PeriodOfServiceMaster,
  'pre-primary-phases': masters.PrePrimaryPhaseMaster,
  'pre-primary-subjects': masters.PrePrimarySubjectMaster,
  'timings': masters.SchoolTimingMaster,
  'service-providers': masters.ServiceProviderMaster,
  'sessions': masters.SessionMaster,
  'streams': masters.StreamMaster,
  'attendance-statuses': masters.StudentAttendanceStatusMaster,
  'subject-groups': masters.SubjectGroupMaster,
  'subject-types': masters.SubjectTypeMaster,
  'terms': masters.TermMaster,
  'transaction-types': masters.TransactionTypeMaster,
  'winter-durations': masters.WinterDurationMaster,
  'winter-timing-gaps': masters.WinterTimingGapMaster,
  'zones': masters.ZoneMaster,
  'blood-groups': masters.BloodGroupMaster,
  'religions': masters.ReligionMaster,
  'casts': masters.CastMaster,
  'mother-tongues': masters.MotherTongueMaster,
};

// --- Middleware to Get Model ---
const getMasterModel = (req, res, next) => {
  const model = masterRegistry[req.params.masterType];
  if (!model) {
    return res.status(404).json({ code: 404, message: `Master type '${req.params.masterType}' not found` });
  }
  req.MasterModel = model;
  next();
};

// --- Generic Controller Logic ---

const listMasters = async (req, res) => {
  const { status, all } = req.query;
  const where = {};
  
  if (!all) where.is_deleted = false;
  if (status) where.status = status;

  const data = await req.MasterModel.findAll({
    where,
    order: [['created_at', 'DESC']]
  });
  
  res.json({ code: 200, data });
};

const getMaster = async (req, res) => {
  const data = await req.MasterModel.findByPk(req.params.id);
  if (!data) return res.status(404).json({ code: 404, message: 'Record not found' });
  res.json({ code: 200, data });
};

const createMaster = async (req, res) => {
  const data = await req.MasterModel.create(req.body);
  res.status(201).json({ code: 201, message: 'Created successfully', data });
};

const updateMaster = async (req, res) => {
  const record = await req.MasterModel.findByPk(req.params.id);
  if (!record) return res.status(404).json({ code: 404, message: 'Record not found' });
  
  await record.update(req.body);
  res.json({ code: 200, message: 'Updated successfully', data: record });
};

const deleteMaster = async (req, res) => {
  const record = await req.MasterModel.findByPk(req.params.id);
  if (!record) return res.status(404).json({ code: 404, message: 'Record not found' });
  
  // Soft delete if column exists, else hard delete
  if (record.is_deleted !== undefined) {
    await record.update({ is_deleted: true });
  } else {
    await record.destroy();
  }
  
  res.json({ code: 200, message: 'Deleted successfully' });
};

// --- Routes ---

router.use('/:masterType', getMasterModel);

router.get('/:masterType', catchAsync(listMasters));
router.get('/:masterType/:id', catchAsync(getMaster));
router.post('/:masterType', catchAsync(createMaster));
router.patch('/:masterType/:id', catchAsync(updateMaster));
router.delete('/:masterType/:id', catchAsync(deleteMaster));

module.exports = router;
