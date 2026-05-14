const { AdmissionInquiry, School, GradeMaster, sequelize } = require('../models');
const { Op } = require('sequelize');

const listAdmissionInquiriesRepo = async (args) => {
  const where = { is_deleted: false };
  
  const { count, rows } = await AdmissionInquiry.findAndCountAll({
    where,
    include: [
      { model: School, as: 'school_ref', attributes: ['school_name'] },
      { model: GradeMaster, as: 'grade_ref', attributes: ['name', 'short_form'] }
    ],
    order: [['created_at', 'DESC']],
    limit: args.limit,
    offset: (args.page - 1) * args.limit,
    distinct: true
  });

  const schools = await School.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('school_name')), 'school_name']],
    where: { deleted_at: null },
    order: [['school_name', 'ASC']]
  });

  const grades = await GradeMaster.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('name')), 'name']],
    where: { is_deleted: false },
    order: [['name', 'ASC']]
  });

  return {
    rows,
    total: count,
    schools: schools.map(s => s.school_name).filter(Boolean),
    grades: grades.map(g => g.name).filter(Boolean)
  };
};

const updateAdmissionInquiryStatusRepo = async (id, status) => {
  const inquiry = await AdmissionInquiry.findByPk(id);
  if (inquiry) {
    inquiry.status = status;
    await inquiry.save();
    return inquiry;
  }
  return null;
};

const softDeleteAdmissionInquiryRepo = async (id, deletedBy) => {
  const inquiry = await AdmissionInquiry.findByPk(id);
  if (inquiry) {
    inquiry.is_deleted = true;
    inquiry.deleted_at = new Date();
    inquiry.deleted_by = deletedBy;
    await inquiry.save();
    return inquiry;
  }
  return null;
};

const createAdmissionInquiryRepo = async (args) => {
  const [school, grade] = await Promise.all([
    School.findOne({
      where: {
        deleted_at: null,
        [Op.or]: [
          { school_name: { [Op.iLike]: args.school } },
          { school_code: { [Op.iLike]: args.school } },
          { brand_code: { [Op.iLike]: args.school } }
        ]
      }
    }),
    GradeMaster.findOne({
      where: {
        is_deleted: false,
        [Op.or]: [
          { name: { [Op.iLike]: args.grade } },
          { short_form: { [Op.iLike]: args.grade } }
        ]
      }
    })
  ]);

  return AdmissionInquiry.create({
    ...args,
    school_id: school?.school_id || null,
    grade_id: grade?.id || null,
    school: args.school,
    grade: args.grade,
    status: 'NEW'
  });
};

module.exports = {
  listAdmissionInquiriesRepo,
  updateAdmissionInquiryStatusRepo,
  softDeleteAdmissionInquiryRepo,
  createAdmissionInquiryRepo,
};
