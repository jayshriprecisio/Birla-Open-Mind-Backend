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

const ApiError = require("../utils/api-error");

const createAdmissionRepo = async (data) => {
  // If enquiry_no is passed as a UUID (common mistake in frontend), resolve it to the actual enquiry_no
  if (data.enquiry_no && /^[0-9a-fA-F-]{36}$/.test(data.enquiry_no)) {
    console.log("DEBUG: Detected UUID in enquiry_no, resolving to number...");
    const enquiry = await SchoolEnquiry.findByPk(data.enquiry_no);
    if (enquiry) {
      console.log(
        `DEBUG: Resolved UUID ${data.enquiry_no} to Enquiry No ${enquiry.enquiry_no}`,
      );
      data.enquiry_no = enquiry.enquiry_no;
    } else {
      console.warn(`DEBUG: Could not find enquiry with ID ${data.enquiry_no}`);
    }
  }

  // Explicitly check if enquiry exists if enquiry_no is provided
  if (data.enquiry_no) {
    const enquiryExists = await SchoolEnquiry.findOne({
      where: { enquiry_no: data.enquiry_no },
    });
    if (!enquiryExists) {
      throw new ApiError(
        400,
        `Invalid Enquiry Number: The enquiry '${data.enquiry_no}' does not exist in the database. Please verify the enquiry number or leave it blank if not applicable.`,
      );
    }
  }

  console.log(
    "DEBUG: Data being sent to StudentAdmissions.create:",
    JSON.stringify(data, null, 2),
  );
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
      "created_at",
      "status",
      "payment_status",
    ],
    include: [
      {
        model: School,
        as: "school",
        attributes: ["school_name", "school_code"],
      },
      { model: GradeMaster, as: "grade", attributes: ["name", "short_form"] },
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
      {
        model: AcademicYearMaster,
        as: "academic_year",
        attributes: ["name", "short_form"],
      },
      {
        model: BloodGroupMaster,
        as: "blood_group",
        attributes: ["name", "display_order"],
      },
      {
        model: ReligionMaster,
        as: "religion",
        attributes: ["name", "display_order"],
      },
      { model: CastMaster, as: "cast", attributes: ["name", "display_order"] },
      {
        model: MotherTongueMaster,
        as: "mother_tongue",
        attributes: ["name", "display_order"],
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
  });
};

const getLastAdmissionRepo = async (prefix) => {
  return await StudentAdmissions.findOne({
    where: {
      registration_no: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["registration_no", "DESC"]],
  });
};

module.exports = {
  createAdmissionRepo,
  getAllAdmissionsRepo,
  getAdmissionByIdRepo,
  updateAdmissionRepo,
  deleteAdmissionRepo,
  getLastAdmissionRepo,
};
