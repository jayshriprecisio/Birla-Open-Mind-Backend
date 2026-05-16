const { AdmissionInquiry, School, GradeMaster, SourceMaster, sequelize } = require('../models');
const { Op } = require('sequelize');

const listAdmissionInquiriesRepo = async (args) => {
  const where = { is_deleted: false };
  
  if (args.q) {
    const q = `%${args.q}%`;
    where[Op.or] = [
      { parent_first_name: { [Op.iLike]: q } },
      { parent_last_name: { [Op.iLike]: q } },
      { email: { [Op.iLike]: q } },
      { phone_number: { [Op.iLike]: q } },
      { '$school_ref.school_name$': { [Op.iLike]: q } }
    ];
  }

  if (args.status && args.status.toUpperCase() !== 'ALL') {
    const statusFilter = args.status.toUpperCase();
    // Imported rows may use OPEN; treat as NEW in filters
    where.status = statusFilter === 'NEW' ? { [Op.in]: ['NEW', 'OPEN'] } : args.status;
  }

  if (args.school && args.school.toUpperCase() !== 'ALL') {
    where['$school_ref.school_name$'] = args.school;
  }

  if (args.grade && args.grade.toUpperCase() !== 'ALL') {
    where['$grade_ref.name$'] = args.grade;
  }

  if (args.dateFrom && args.dateFrom.trim() !== '') {
    where.created_at = { ...where.created_at, [Op.gte]: new Date(args.dateFrom) };
  }
  if (args.dateTo && args.dateTo.trim() !== '') {
    where.created_at = { ...where.created_at, [Op.lte]: new Date(args.dateTo) };
  }

  const { count, rows } = await AdmissionInquiry.findAndCountAll({
    where,
    include: [
      { model: School, as: 'school_ref', attributes: ['school_name'] },
      { model: GradeMaster, as: 'grade_ref', attributes: ['name', 'short_form'] },
      {
        model: SourceMaster,
        as: 'source_ref',
        attributes: ['id', 'name'],
        required: false,
      },
    ],
    order: [['created_at', 'DESC']],
    limit: Number(args.limit) || 10,
    offset: (Number(args.page || 1) - 1) * (Number(args.limit) || 10),
    distinct: true
  });

  const schools = await School.findAll({
    attributes: ['school_name'],
    where: { deleted_at: null },
    group: ['school_name'],
    order: [['school_name', 'ASC']]
  });

  const grades = await GradeMaster.findAll({
    attributes: ['name'],
    where: { is_deleted: false },
    group: ['name'],
    order: [['name', 'ASC']]
  });

  return {
    rows: rows.map(r => {
      const json = r.toJSON();
      // Strip metadata from comment if present: "actual comment [Relation: ...]"
      const comment = (json.comment || '').replace(/\s*\[Relation:.*\]/i, '').trim();
      const sourceName = json.source_ref?.name?.trim();
      const isImported = Boolean(json.source_id);
      return {
        ...json,
        comment: comment || '-',
        school_name: json.school_ref?.school_name || json.school || '-',
        grade: json.grade_ref?.short_form || json.grade_ref?.name || json.grade || '-',
        relationship_with_student: json.relationship_with_student || null,
        counsellor_name: null,
        source: isImported ? 'Imported' : (sourceName || null),
      };
    }),
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
  school_id: school?.school_id || null,
  grade_id: grade?.id || null,

  parent_first_name: args.parent_first_name,
  parent_last_name: args.parent_last_name,
  email: args.email,
  phone_number: args.phone_number,

  relationship_with_student: args.relationship_with_student, 
  counsellor_name: args.counsellor_name || null,            

  comment: args.comment || null,
  status: 'NEW'
});

};

const getAdmissionInquiryByPhoneRepo = async (phone) => {
  const inquiry = await AdmissionInquiry.findOne({
    where: { phone_number: phone, is_deleted: false },
    include: [
      { model: School, as: 'school_ref', attributes: ['school_name', 'school_id', 'brand_code', 'zone_id'] },
      { model: GradeMaster, as: 'grade_ref', attributes: ['name', 'short_form'] }
    ],
    order: [['created_at', 'DESC']]
  });

  if (!inquiry) return null;

  const json = inquiry.toJSON();
  return {
    ...json,
    school: json.school_ref?.school_name || '-',
    brand_name: json.school_ref?.brand_code || '-',
    zone_name: json.school_ref?.zone_id || '-',
    grade: json.grade_ref?.short_form || json.grade_ref?.name || '-'
  };
};

module.exports = {
  listAdmissionInquiriesRepo,
  updateAdmissionInquiryStatusRepo,
  softDeleteAdmissionInquiryRepo,
  createAdmissionInquiryRepo,
  getAdmissionInquiryByPhoneRepo,
};

