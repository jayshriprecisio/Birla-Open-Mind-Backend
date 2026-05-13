const { Op, fn, col, where: whereFn } = require('sequelize');
const {
  SchoolEnquiry,
  School,
  GradeMaster,
} = require('../models');

const baseInclude = [
  { model: School, as: 'school', attributes: ['school_name'] },
  { model: GradeMaster, as: 'grade', attributes: ['id', 'name', 'short_form'] },
];

const normalizePhone = (v) => String(v ?? '').replace(/[^0-9]/g, '');

const phoneMatchClause = (cleaned) => ({
  [Op.or]: [
    whereFn(
      fn('REGEXP_REPLACE', fn('COALESCE', col('SchoolEnquiry.father_mobile'), ''), '[^0-9]', '', 'g'),
      cleaned
    ),
    whereFn(
      fn('REGEXP_REPLACE', fn('COALESCE', col('SchoolEnquiry.mother_mobile'), ''), '[^0-9]', '', 'g'),
      cleaned
    ),
    whereFn(
      fn('REGEXP_REPLACE', fn('COALESCE', col('SchoolEnquiry.guardian_mobile'), ''), '[^0-9]', '', 'g'),
      cleaned
    ),
  ],
});

const searchRegistrationsRepo = async ({ enquiry_no, phone }) => {
  const and = [{ is_deleted: false }];

  if (enquiry_no !== undefined && enquiry_no !== null && String(enquiry_no).trim() !== '') {
    and.push({ enquiry_no: String(enquiry_no).trim() });
  }

  if (phone !== undefined && phone !== null && String(phone).trim() !== '') {
    and.push(phoneMatchClause(normalizePhone(phone)));
  }

  return SchoolEnquiry.findAll({
    where: { [Op.and]: and },
    include: baseInclude,
    order: [['created_at', 'DESC']],
    limit: 50,
  });
};

const getRegistrationByEnquiryIdRepo = async (enquiryId) => {
  return SchoolEnquiry.findOne({
    where: { enquiry_id: enquiryId, is_deleted: false },
    include: baseInclude,
  });
};

const listRegistrationsRepo = async ({ search, status, page = 1, pageSize = 50 }) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Math.min(200, Number(pageSize) || 50));

  const baseWhere = { is_deleted: false };

  if (search !== undefined && search !== null && String(search).trim() !== '') {
    const needle = `%${String(search).trim()}%`;
    baseWhere[Op.or] = [
      { enquiry_no:      { [Op.iLike]: needle } },
      { student_name:    { [Op.iLike]: needle } },
      { father_name:     { [Op.iLike]: needle } },
      { mother_name:     { [Op.iLike]: needle } },
      { guardian_name:   { [Op.iLike]: needle } },
      { father_mobile:   { [Op.iLike]: needle } },
      { mother_mobile:   { [Op.iLike]: needle } },
      { guardian_mobile: { [Op.iLike]: needle } },
    ];
  }

  const listWhere = { ...baseWhere };
  if (status && String(status).toUpperCase() !== 'ALL') {
    listWhere.status = { [Op.iLike]: String(status).trim() };
  }

  const { rows, count } = await SchoolEnquiry.findAndCountAll({
    where: listWhere,
    include: baseInclude,
    order: [['created_at', 'DESC']],
    limit: safePageSize,
    offset: (safePage - 1) * safePageSize,
    distinct: true,
    col: 'enquiry_id',
  });

  const [total, registered, cancelled] = await Promise.all([
    SchoolEnquiry.count({ where: baseWhere, distinct: true, col: 'enquiry_id' }),
    SchoolEnquiry.count({
      where: { ...baseWhere, status: { [Op.iLike]: 'REGISTERED' } },
      distinct: true,
      col: 'enquiry_id',
    }),
    SchoolEnquiry.count({
      where: { ...baseWhere, status: { [Op.iLike]: 'CANCELLED' } },
      distinct: true,
      col: 'enquiry_id',
    }),
  ]);

  return {
    rows,
    page: safePage,
    pageSize: safePageSize,
    total: count,
    counters: { total, registered, cancelled },
  };
};

module.exports = {
  searchRegistrationsRepo,
  getRegistrationByEnquiryIdRepo,
  listRegistrationsRepo,
};
