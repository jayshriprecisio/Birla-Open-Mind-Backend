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
} = require("../models/masters.model");

const createAdmissionRepo = async (data) => {
  return await StudentAdmissions.create(data);
};

const getAllAdmissionsRepo = async (args) => {
  const where = { is_deleted: false };

  const { count, rows } = await StudentAdmissions.findAndCountAll({
    where,
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
    updated_by: deletedBy,
  });
};

module.exports = {
  createAdmissionRepo,
  getAllAdmissionsRepo,
  getAdmissionByIdRepo,
  updateAdmissionRepo,
  deleteAdmissionRepo,
};
