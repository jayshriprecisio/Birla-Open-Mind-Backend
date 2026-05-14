const { StudentAdmissions, School, GradeMaster, SchoolEnquiry, sequelize } = require('../models');
const { Op } = require('sequelize');

const createAdmissionRepo = async (data) => {
  return await StudentAdmissions.create(data);
};

const getAllAdmissionsRepo = async (args) => {
  const where = { is_deleted: false };

  if (args.q) {
    const q = `%${args.q}%`;
    where[Op.or] = [
      { student_name: { [Op.iLike]: q } },
      { registration_no: { [Op.iLike]: q } },
      { admission_no: { [Op.iLike]: q } },
      { father_name: { [Op.iLike]: q } },
      { mother_name: { [Op.iLike]: q } },
      { father_mobile: { [Op.iLike]: q } },
      { mother_mobile: { [Op.iLike]: q } },
    ];
  }

  if (args.status && args.status.toUpperCase() !== 'ALL') {
    where.status = args.status;
  }

  if (args.school_id) {
    where.school_id = args.school_id;
  }

  if (args.grade_applying_for_id) {
    where.grade_applying_for_id = args.grade_applying_for_id;
  }

  if (args.grade_id) {
    where.grade_id = args.grade_id;
  }

  if (args.academic_session_id) {
    where.academic_session_id = args.academic_session_id;
  }

  const { count, rows } = await StudentAdmissions.findAndCountAll({
    where,
    include: [
      { model: School, as: 'school', attributes: ['school_name', 'school_code'] },
      { model: GenderMaster, as: 'gender', attributes: ['name', 'short_form'] },
      { model: GradeMaster, as: 'grade_applying_for', attributes: ['name', 'short_form'] },
      { model: GradeMaster, as: 'grade', attributes: ['name', 'short_form'] },
      { model: BoardMaster, as: 'board', attributes: ['board_name', 'board_code'] },
      { model: SchoolEnquiry, as: 'enquiry', attributes: ['enquiry_no', 'enquiry_id'] }
    ],
    order: [['created_at', 'DESC']],
    limit: args.limit,
    offset: (args.page - 1) * args.limit,
    distinct: true
  });

  return {
    rows,
    total: count,
    page: args.page,
    limit: args.limit
  };
};

const getAdmissionByIdRepo = async (id) => {
  return await StudentAdmissions.findOne({
    where: { id: id, is_deleted: false },
    include: [
      { model: School, as: 'school' },
      { model: GenderMaster, as: 'gender' },
      { model: GradeMaster, as: 'grade_applying_for' },
      { model: GradeMaster, as: 'grade' },
      { model: BoardMaster, as: 'board' },
      { model: SchoolEnquiry, as: 'enquiry' }
    ]
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
    updated_by: deletedBy
  });
};

module.exports = {
  createAdmissionRepo,
  getAllAdmissionsRepo,
  getAdmissionByIdRepo,
  updateAdmissionRepo,
  deleteAdmissionRepo
};
