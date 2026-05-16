const models = require('../../models');
const masters = require('../../models/masters.model');

const masterRegistry = {
  // New Masters
  'interaction': models.InteractionMaster,
  'priority': models.PriorityMaster,
  'stage': models.StageMaster,
  'followup-status': models.FollowupStatusMaster,

  // Legacy Masters (from masters.model.js)
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
  'sources': masters.SourceMaster,
};

module.exports = masterRegistry;
