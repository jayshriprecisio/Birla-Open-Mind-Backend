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
  console.log("createAdmissionRepo called with data: ", data);
  if (data.enquiry_id) {
    const enquiryExists = await SchoolEnquiry.findOne({
      where: { enquiry_id: data.enquiry_id },
      raw: true,
    });

    if (!enquiryExists) {
      throw new ApiError(
        400,
        `Invalid Enquiry ID: The enquiry with ID '${data.enquiry_id}' does not exist in the database.`,
      );
    }

    // Populate missing fields from enquiry
    data.enquiry_no = data.enquiry_no || enquiryExists.enquiry_no;
    data.source_id = data.source_id || enquiryExists.source_id;
    data.contact_mode_id = data.contact_mode_id || enquiryExists.contact_mode_id;
  }

  // Handle Update or Create based on enquiry_id or id
  let admission = null;

  if (data.id) {
    admission = await StudentAdmissions.findOne({
      where: { id: data.id, is_deleted: false },
    });
  } else if (data.enquiry_id) {
    admission = await StudentAdmissions.findOne({
      where: { enquiry_id: data.enquiry_id, is_deleted: false },
    });
  }

  if (admission) {
    return await admission.update(data);
  }

  return await StudentAdmissions.create(data);
};

const getAllAdmissionsRepo = async (args) => {
  const where = { is_deleted: false };

  if (args.search) {
    where[Op.or] = [
      { registration_no: { [Op.iLike]: `%${args.search}%` } },
      { enrollment_no: { [Op.iLike]: `%${args.search}%` } },
      { student_name: { [Op.iLike]: `%${args.search}%` } },
      { aadhar_no: { [Op.iLike]: `%${args.search}%` } },
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

const getAdmissionBySearchRepo = async (args) => {
  const where = { is_deleted: false };

  // If both exist → match both
  if (args.registration_no && args.father_mobile) {
    where.registration_no = args.registration_no;
    where.father_mobile = args.father_mobile;
  }

  // If only registration_no exists
  else if (args.registration_no) {
    where.registration_no = args.registration_no;
  }

  // If only father_mobile exists
  else if (args.father_mobile) {
    where.father_mobile = args.father_mobile;
  }

  const result = await StudentAdmissions.findOne({
    where,
    attributes: [
      "registration_no",
      "enrollment_no",
      "enquiry_no",
      "enquiry_id",
      "source_id",
      "contact_mode_id",
      "student_name",
      "aadhar_no",
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

      // Status
      "status",
      "academic_year_id",
      "school_id",
      "grade_applying_for_id",
      "grade_id",
      "board_id",
      "gender_id",
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
    ],
  });

  if (!result) {
    const enquiry = await SchoolEnquiry.findOne({
      where: {
        father_mobile: args.father_mobile || null,
        is_deleted: false,
      },
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
          as: "current_grade",
          attributes: ["id", "name", "short_form"],
        },
        {
          model: BoardMaster,
          as: "board",
          attributes: ["id", "board_code", "board_name"],
        },
        { model: GenderMaster, as: "gender", attributes: ["id", "name"] },
      ],
    });

    console.log("Enquiry found ", enquiry);

    if (!enquiry) return null;

    const plainEnquiry = enquiry.get({ plain: true });

    // Map SchoolEnquiry to StudentAdmissions format
    return {
      registration_no: plainEnquiry.registration_no || null,
      enrollment_no: plainEnquiry.enrollment_no || null,
      enquiry_no: plainEnquiry.enquiry_no,
      enquiry_id: plainEnquiry.enquiry_id,
      source_id: plainEnquiry.source_id,
      contact_mode_id: plainEnquiry.contact_mode_id,
      student_name: plainEnquiry.student_name,
      aadhar_no: plainEnquiry.aadhaar_no,
      dob: plainEnquiry.dob,
      nationality: null,
      place_of_birth: null,

      prev_school_tc_no: null,
      prev_school_leaving_date: null,
      prev_class_passed: null,
      prev_class_percentage: null,

      // Father Details
      father_name: plainEnquiry.father_name,
      father_mobile: plainEnquiry.father_mobile,
      father_email: plainEnquiry.father_email,
      father_occupation: null,
      father_aadhar_no: null,
      father_pan_no: null,
      father_employer_name: null,
      father_designation: null,
      father_annual_income: null,
      father_employer_address: null,
      father_employer_city: null,
      father_employer_state: null,
      father_employer_pincode: null,
      father_employer_country: null,

      // Mother Details
      mother_name: plainEnquiry.mother_name,
      mother_mobile: plainEnquiry.mother_mobile,
      mother_email: plainEnquiry.mother_email,
      mother_occupation: null,
      mother_aadhar_no: null,
      mother_pan_no: null,
      mother_employer_name: null,
      mother_designation: null,
      mother_annual_income: null,
      mother_employer_address: null,
      mother_employer_city: null,
      mother_employer_state: null,
      mother_employer_pincode: null,
      mother_employer_country: null,

      // Guardian Details
      guardian_name: plainEnquiry.guardian_name,
      guardian_mobile: plainEnquiry.guardian_mobile,
      guardian_email: null,
      guardian_relation: null,
      guardian_aadhar_no: null,
      guardian_pan_no: null,

      // Address
      address:
        plainEnquiry?.address ||
        [
          plainEnquiry.address_line1,
          plainEnquiry.address_line2,
          plainEnquiry.address_line3,
        ]
          .filter(Boolean)
          .join(",") ||
        "",
      city: plainEnquiry.city,
      state: plainEnquiry.state,
      country: plainEnquiry.country,
      pincode: plainEnquiry.pincode,

      // Admission & Medical
      admission_no: null,
      medical_conditions: null,
      emergency_contact: null,
      custody_situation: null,

      // Status
      status: "DRAFT",

      // Associations
      academic_year: plainEnquiry.academic_year,
      school: plainEnquiry.school,
      grade: plainEnquiry.current_grade || null,
      grade_applying_for: plainEnquiry.grade || null,
      board: plainEnquiry.board,
      gender: plainEnquiry.gender,
      blood_group: plainEnquiry.blood_group || null,
      religion: plainEnquiry.religion || null,
      cast: plainEnquiry.cast || null,
      mother_tongue: plainEnquiry.mother_tongue || null,
    };
  }

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
      "aadhar_no",
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
  getAdmissionBySearchRepo,
  getAdmissionByIdRepo,
  updateAdmissionRepo,
  deleteAdmissionRepo,
  getLastAdmissionRepo,
};
