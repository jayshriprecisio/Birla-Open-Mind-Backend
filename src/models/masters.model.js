const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const commonOptions = {
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
};

const AcademicMaster = sequelize.define(
  "AcademicMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    academic_name: { type: DataTypes.STRING(180), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "academic_master" },
);

const AcademicSubjectMaster = sequelize.define(
  "AcademicSubjectMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "academic_subject_master" },
);

const AcademicYearMaster = sequelize.define(
  "AcademicYearMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    short_form_2_digit: { type: DataTypes.STRING(10) },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "academic_year_master" },
);

const BatchMaster = sequelize.define(
  "BatchMaster",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    batch_name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "batch_master" },
);

const BoardMaster = sequelize.define(
  "BoardMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    board_code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    board_name: { type: DataTypes.STRING(100), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
    updated_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "board_master" },
);

const BrandMaster = sequelize.define(
  "BrandMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    brand_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { ...commonOptions, tableName: "brand_master" },
);

const CalculationBasisMaster = sequelize.define(
  "CalculationBasisMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    calculation_basis_name: { type: DataTypes.STRING(180), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "calculation_basis_master" },
);

const ChequeFavourMaster = sequelize.define(
  "ChequeFavourMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cheque_in_favour_of: { type: DataTypes.STRING(150), allowNull: false },
    fees_type: { type: DataTypes.STRING(100), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "cheque_favour_master" },
);

const CourseMaster = sequelize.define(
  "CourseMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    course_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    course_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "course_master" },
);

const DivisionMaster = sequelize.define(
  "DivisionMaster",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    division_name: { type: DataTypes.STRING(100), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "division_master" },
);

const FeesCategoryMaster = sequelize.define(
  "FeesCategoryMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    fees_category_name: { type: DataTypes.STRING(160), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "fees_category_master" },
);

const FeesSubTypeMaster = sequelize.define(
  "FeesSubTypeMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    fees_sub_type_name: { type: DataTypes.STRING(140), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "fees_sub_type_master" },
);

const FeesTypeMaster = sequelize.define(
  "FeesTypeMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    fees_type_name: { type: DataTypes.STRING(120), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "fees_type_master" },
);

const GenderMaster = sequelize.define(
  "GenderMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    short_form: { type: DataTypes.STRING(10) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "gender_master" },
);

const GradeMaster = sequelize.define(
  "GradeMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "grade_master" },
);

const HouseMaster = sequelize.define(
  "HouseMaster",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    house_name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "house_master" },
);

const ModeOfPaymentMaster = sequelize.define(
  "ModeOfPaymentMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    mode_of_payment_name: { type: DataTypes.STRING(150), allowNull: false },
    name_on_receipt: { type: DataTypes.STRING(150), allowNull: false },
    visible_to_parent: { type: DataTypes.STRING(10), allowNull: false },
    visible_to_fee_counter: { type: DataTypes.STRING(10), allowNull: false },
    order_of_preference: { type: DataTypes.INTEGER, defaultValue: 1 },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "mode_of_payment_master" },
);

const ModeOfContactMaster = sequelize.define(
  "ModeOfContactMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "mode_of_contact_master" },
);

const LeadStageMaster = sequelize.define(
  "LeadStageMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "lead_stage_master" },
);

const SchoolTypeMaster = sequelize.define(
  "SchoolTypeMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "school_type_master" },
);

const EnquirySourceMaster = sequelize.define(
  "EnquirySourceMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "enquiry_source_master" },
);

const EnquirySubSourceMaster = sequelize.define(
  "EnquirySubSourceMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "enquiry_sub_source_master" },
);

const FatherOccupationMaster = sequelize.define(
  "FatherOccupationMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "father_occupation_master" },
);

const ParameterMaster = sequelize.define(
  "ParameterMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    parameter_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "parameter_master" },
);

const PaymentEntityMaster = sequelize.define(
  "PaymentEntityMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    entity_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "payment_entity_master" },
);

const PdcStatusMaster = sequelize.define(
  "PdcStatusMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    pdc_status: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "pdc_status_master" },
);

const PeriodOfServiceMaster = sequelize.define(
  "PeriodOfServiceMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    period_of_service_name: { type: DataTypes.STRING(180), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "period_of_service_master" },
);

const PrePrimaryPhaseMaster = sequelize.define(
  "PrePrimaryPhaseMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    phase_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "pre_primary_phase_master" },
);

const PrePrimarySubjectMaster = sequelize.define(
  "PrePrimarySubjectMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "pre_primary_subject_master" },
);

const SchoolTimingMaster = sequelize.define(
  "SchoolTimingMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    timing_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    shift_name: { type: DataTypes.STRING(100), allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "school_timing_master" },
);

const ServiceProviderMaster = sequelize.define(
  "ServiceProviderMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    service_provider_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "service_provider_master" },
);

const SessionMaster = sequelize.define(
  "SessionMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    session_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "session_master" },
);

const StreamMaster = sequelize.define(
  "StreamMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "stream_master" },
);

const StudentAttendanceStatusMaster = sequelize.define(
  "StudentAttendanceStatusMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "student_attendance_status_master" },
);

const SubjectGroupMaster = sequelize.define(
  "SubjectGroupMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    subject_group_name: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "subject_group_master" },
);

const SubjectTypeMaster = sequelize.define(
  "SubjectTypeMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    short_form: { type: DataTypes.STRING(20) },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "subject_type_master" },
);

const TermMaster = sequelize.define(
  "TermMaster",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    term_name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "term_master" },
);

const TransactionTypeMaster = sequelize.define(
  "TransactionTypeMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    transaction_type: { type: DataTypes.STRING(100), allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "transaction_type_master" },
);

const WinterDurationMaster = sequelize.define(
  "WinterDurationMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    winter_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    winter_duration_days: { type: DataTypes.INTEGER, allowNull: false },
    winter_start_date: { type: DataTypes.DATEONLY, allowNull: false },
    winter_end_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { ...commonOptions, tableName: "winter_duration_master" },
);

const WinterTimingGapMaster = sequelize.define(
  "WinterTimingGapMaster",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    winter_timing_gap: { type: DataTypes.STRING, allowNull: false }, // Store as interval string
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "winter_timing_gap_master" },
);

const ZoneMaster = sequelize.define(
  "ZoneMaster",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    zone_name: { type: DataTypes.STRING(100), allowNull: false },
    short_form: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.BIGINT },
  },
  { ...commonOptions, tableName: "zone_master" },
);

const BloodGroupMaster = sequelize.define(
  "BloodGroupMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "blood_group_master" },
);

const ReligionMaster = sequelize.define(
  "ReligionMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "religion_master" },
);

const CastMaster = sequelize.define(
  "CastMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    short_form: { type: DataTypes.STRING(50), allowNull: false },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "cast_master" },
);

const MotherTongueMaster = sequelize.define(
  "MotherTongueMaster",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    display_order: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(10), defaultValue: "ACTIVE" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING(50) },
    updated_by: { type: DataTypes.STRING(50) },
  },
  { ...commonOptions, tableName: "mother_tongue_master" },
);


const masterModels = {
  AcademicMaster,
  AcademicSubjectMaster,
  AcademicYearMaster,
  BatchMaster,
  BoardMaster,
  BrandMaster,
  CalculationBasisMaster,
  ChequeFavourMaster,
  CourseMaster,
  DivisionMaster,
  EnquirySourceMaster,
  EnquirySubSourceMaster,
  FatherOccupationMaster,
  FeesCategoryMaster,
  FeesSubTypeMaster,
  FeesTypeMaster,
  GenderMaster,
  GradeMaster,
  HouseMaster,
  LeadStageMaster,
  ModeOfPaymentMaster,
  ModeOfContactMaster,
  ParameterMaster,
  PaymentEntityMaster,
  PdcStatusMaster,
  PeriodOfServiceMaster,
  PrePrimaryPhaseMaster,
  PrePrimarySubjectMaster,
  SchoolTimingMaster,
  SchoolTypeMaster,
  ServiceProviderMaster,
  SessionMaster,
  StreamMaster,
  StudentAttendanceStatusMaster,
  SubjectGroupMaster,
  SubjectTypeMaster,
  TermMaster,
  TransactionTypeMaster,
  WinterDurationMaster,
  WinterTimingGapMaster,
  ZoneMaster,
  BloodGroupMaster,
  ReligionMaster,
  CastMaster,
  MotherTongueMaster,
};


const masterRegistry = {
  "academic-masters": AcademicMaster,
  "academic-subjects": AcademicSubjectMaster,
  "academic-years": AcademicYearMaster,
  batches: BatchMaster,
  boards: BoardMaster,
  brands: BrandMaster,
  "calculation-basis": CalculationBasisMaster,
  "cheque-favour": ChequeFavourMaster,
  courses: CourseMaster,
  divisions: DivisionMaster,
  "enquiry-sources": EnquirySourceMaster,
  "enquiry-sub-sources": EnquirySubSourceMaster,
  "father-occupations": FatherOccupationMaster,
  "fees-categories": FeesCategoryMaster,
  "fees-sub-types": FeesSubTypeMaster,
  "fees-types": FeesTypeMaster,
  genders: GenderMaster,
  grades: GradeMaster,
  houses: HouseMaster,
  "lead-stages": LeadStageMaster,
  "payment-modes": ModeOfPaymentMaster,
  "contact-modes": ModeOfContactMaster,
  parameters: ParameterMaster,
  "payment-entities": PaymentEntityMaster,
  "pdc-statuses": PdcStatusMaster,
  "service-periods": PeriodOfServiceMaster,
  "pre-primary-phases": PrePrimaryPhaseMaster,
  "pre-primary-subjects": PrePrimarySubjectMaster,
  timings: SchoolTimingMaster,
  "school-types": SchoolTypeMaster,
  "service-providers": ServiceProviderMaster,
  sessions: SessionMaster,
  streams: StreamMaster,
  "attendance-statuses": StudentAttendanceStatusMaster,
  "subject-groups": SubjectGroupMaster,
  "subject-types": SubjectTypeMaster,
  terms: TermMaster,
  "transaction-types": TransactionTypeMaster,
  "winter-durations": WinterDurationMaster,
  "winter-timing-gaps": WinterTimingGapMaster,
  zones: ZoneMaster,
  "blood-groups": BloodGroupMaster,
  religions: ReligionMaster,
  casts: CastMaster,
  "mother-tongues": MotherTongueMaster,
};

module.exports = {
  ...masterModels,
  masterModels,
  masterRegistry,
};
