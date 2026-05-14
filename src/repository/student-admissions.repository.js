const {
  StudentAdmissions,
  School,
  GradeMaster,
  SchoolEnquiry,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const {
  GenderMaster,
  BoardMaster,
  ModeOfPaymentMaster,
  AcademicYearMaster,
  BloodGroupMaster,
  ReligionMaster,
  CastMaster,
  MotherTongueMaster,
} = require("../models/masters.model");

const createAdmissionRepo = async (data) => {
  console.log("Creating admission with data:", data);
  return await StudentAdmissions.create(data);
};

const getAllAdmissionsRepo = async (args) => {
  const where = { is_deleted: false };

  const { count, rows } = await StudentAdmissions.findAndCountAll({
    where,
    attributes: [
      "id",
      "registration_no",
      "enrollment_no",
      "student_name",
      "father_name",
      "father_mobile",
      "grade_id",
      "school_id",
      "created_at",
      "status",
      "payment_status",
    ],
    order: [["created_at", "DESC"]],
    limit: args.limit,
    offset: (args.page - 1) * args.limit,
    distinct: true,
  });

  return {
    rows,
    total: count,
    page: args.page,
    limit: args.limit,
  };
};

const getAdmissionByIdRepo = async (id) => {
  return await StudentAdmissions.findOne({
    where: { id: id, is_deleted: false },
    include: [
      {
        model: School,
        as: "school",
        attributes: ["school_name", "school_code"],
      },
      { model: GenderMaster, as: "gender", attributes: ["name", "short_form"] },
      {
        model: GradeMaster,
        as: "grade_applying_for",
        attributes: ["name", "short_form"],
      },
      { model: GradeMaster, as: "grade", attributes: ["name", "short_form"] },
      {
        model: BoardMaster,
        as: "board",
        attributes: ["board_name", "board_code"],
      },
      {
        model: ModeOfPaymentMaster,
        as: "payment_mode",
        attributes: ["mode_of_payment_name", "name_on_receipt"],
      },
      {
        model: SchoolEnquiry,
        as: "enquiry",
        attributes: ["enquiry_no", "enquiry_id"],
      },
      { model: AcademicYearMaster, as: "academic_year", attributes: ["name", "short_form"] },
      { model: BloodGroupMaster, as: "blood_group", attributes: ["name", "display_order"] },
      { model: ReligionMaster, as: "religion", attributes: ["name", "display_order"] },
      { model: CastMaster, as: "cast", attributes: ["name", "display_order"] },
      { model: MotherTongueMaster, as: "mother_tongue", attributes: ["name", "display_order"] },
    ],
  });
};

const updateAdmissionRepo = async (id, data) => {
  const admission = await StudentAdmissions.findByPk(id);
  if (!admission || admission.is_deleted) return null;

  return await admission.update(data);
};

const deleteAdmissionRepo = async (id, deletedBy) => {
  const admission = await StudentAdmissions.findByPk(id);
  if (!admission || admission.is_deleted) return null;

  return await admission.update({
    is_deleted: true,
  });
};

module.exports = {
  createAdmissionRepo,
  getAllAdmissionsRepo,
  getAdmissionByIdRepo,
  updateAdmissionRepo,
  deleteAdmissionRepo,
};
