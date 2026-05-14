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

  if (args.search) {
    where[Op.or] = [
      { registration_no: { [Op.iLike]: `%${args.search}%` } },
      { enrollment_no: { [Op.iLike]: `%${args.search}%` } },
      { student_name: { [Op.iLike]: `%${args.search}%` } },
    ];
  }

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
      "is_cheque_cleared",
      "created_at",
    ],
    include: [
      {
        model: School,
        as: "school",
        attributes: ["school_name", "school_code"],
      },
      {
        model: GradeMaster,
        as: "grade",
        attributes: ["id", "name", "short_form"],
      },
      {
        model: GradeMaster,
        as: "grade_applying_for",
        attributes: ["id", "name", "short_form"],
      },
      {
        model: ModeOfPaymentMaster,
        as: "payment_mode",
        attributes: ["id", "mode_of_payment_name", "name_on_receipt"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit: args.limit,
    offset: (args.page - 1) * args.limit,
    distinct: true,
  });

  return {
    pagination: {
      total: count,
      page: args.page,
      limit: args.limit,
    },
    rows,
  };
};

const getAdmissionStatsRepo = async () => {
  const stats = await StudentAdmissions.findAll({
    where: { is_deleted: false },
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"],
    ],
    group: ["status"],
  });

  const result = {
    total: 0,
    completed: 0,
    cancelled: 0,
    paymentPending: 0,
  };

  stats.forEach((stat) => {
    const count = parseInt(stat.get("count"), 10);

    const status = stat.status;

    result.total += count;

    if (status === "COMPLETED") {
      result.completed += count;
    }

    if (status === "CANCELLED") {
      result.cancelled += count;
    }

    if (status === "PENDING") {
      result.paymentPending += count;
    }
  });

  return result;
};

const getAdmissionByIdRepo = async (id) => {
  return await StudentAdmissions.findOne({
    where: { id: id, is_deleted: false },
    attributes: [
      "id",
      "registration_no",
      "enrollment_no",
      "enquiry_no",
      "student_name",
      "dob",
      "nationality",
      "place_of_birth",
      "prev_school_tc_no",
      "prev_school_leaving_date",
      "prev_class_passed",
      "prev_class_percentage",

      // Father Details
      "father_name",
      "father_mobile",
      "father_email",
      "father_occupation",
      "father_aadhar_no",
      "father_pan_no",
      "father_employer_name",
      "father_designation",
      "father_annual_income",
      "father_employer_address",
      "father_employer_city",
      "father_employer_state",
      "father_employer_pincode",
      "father_employer_country",

      // Mother Details
      "mother_name",
      "mother_mobile",
      "mother_email",
      "mother_occupation",
      "mother_aadhar_no",
      "mother_pan_no",
      "mother_employer_name",
      "mother_designation",
      "mother_annual_income",
      "mother_employer_address",
      "mother_employer_city",
      "mother_employer_state",
      "mother_employer_pincode",
      "mother_employer_country",

      // Guardian Details
      "guardian_name",
      "guardian_mobile",
      "guardian_email",
      "guardian_relation",
      "guardian_aadhar_no",
      "guardian_pan_no",

      // Address
      "address",
      "city",
      "state",
      "country",
      "pincode",

      // Admission & Medical
      "admission_no",
      "medical_conditions",
      "emergency_contact",
      "custody_situation",

      // Payment
      "admission_fee_amount",
      "cheque_no",
      "cheque_bank_name",
      "is_cheque_cleared",
      "upi_reference",
      "card_last_four",

      // Status
      "status",
      "is_deleted",
      "created_at",
      "updated_at",
    ],
    include: [
      {
        model: AcademicYearMaster,
        as: "academic_year",
        attributes: ["id", "name"],
      },
      {
        model: School,
        as: "school",
        attributes: ["school_id", "school_name", "school_code"],
      },
      {
        model: GradeMaster,
        as: "grade",
        attributes: ["id", "name", "short_form"],
      },
      {
        model: GradeMaster,
        as: "grade_applying_for",
        attributes: ["id", "name", "short_form"],
      },
      {
        model: BoardMaster,
        as: "board",
        attributes: ["id", "board_code", "board_name"],
      },
      { model: GenderMaster, as: "gender", attributes: ["id", "name"] },
      {
        model: BloodGroupMaster,
        as: "blood_group",
        attributes: ["id", "name"],
      },
      {
        model: ReligionMaster,
        as: "religion",
        attributes: ["id", "name"],
      },
      { model: CastMaster, as: "cast", attributes: ["id", "name"] },
      {
        model: MotherTongueMaster,
        as: "mother_tongue",
        attributes: ["id", "name"],
      },
      {
        model: ModeOfPaymentMaster,
        as: "payment_mode",
        attributes: ["id", "mode_of_payment_name", "name_on_receipt"],
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
  getAdmissionStatsRepo,
  getAdmissionByIdRepo,
  updateAdmissionRepo,
  deleteAdmissionRepo,
  getLastAdmissionRepo,
};
