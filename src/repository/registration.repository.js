const { Op, fn, col, literal, where: whereFn } = require('sequelize');
const { SchoolEnquiry, School, GradeMaster } = require('../models');

const MOBILE_COLUMNS = ['father_mobile', 'mother_mobile', 'guardian_mobile'];
const SEARCH_COLUMNS = [
  'enquiry_no', 'student_name',
  'father_name', 'mother_name', 'guardian_name',
  ...MOBILE_COLUMNS,
];

const include = [
  { model: School, as: 'school', attributes: ['school_name'] },
  { model: GradeMaster, as: 'grade', attributes: ['id', 'name', 'short_form'] },
];

const trimOrNull = (v) => {
  const s = v == null ? '' : String(v).trim();
  return s || null;
};

const phoneClause = (digits) => ({
  [Op.or]: MOBILE_COLUMNS.map((c) =>
    whereFn(fn('REGEXP_REPLACE', fn('COALESCE', col(c), ''), '[^0-9]', '', 'g'), digits)
  ),
});

const searchRegistrationsRepo = ({ enquiry_no, phone }) => {
  const where = { is_deleted: false };
  const en = trimOrNull(enquiry_no);
  const ph = trimOrNull(phone);

  if (en) where.enquiry_no = en;
  if (ph) Object.assign(where, phoneClause(ph.replace(/[^0-9]/g, '')));

  return SchoolEnquiry.findAll({
    where,
    include,
    order: [['created_at', 'DESC']],
    limit: 50,
  });
};

const listRegistrationsRepo = async ({ search, status, page = 1, pageSize = 50 }) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Math.min(200, Number(pageSize) || 50));

  const baseWhere = { is_deleted: false };
  const needle = trimOrNull(search);
  if (needle) {
    const like = `%${needle}%`;
    baseWhere[Op.or] = SEARCH_COLUMNS.map((c) => ({ [c]: { [Op.iLike]: like } }));
  }

  const statusFilter = trimOrNull(status);
  const listWhere = statusFilter && statusFilter.toUpperCase() !== 'ALL'
    ? { ...baseWhere, status: { [Op.iLike]: statusFilter } }
    : baseWhere;

  const [{ rows, count }, counters] = await Promise.all([
    SchoolEnquiry.findAndCountAll({
      where: listWhere,
      include,
      order: [['created_at', 'DESC']],
      limit: safePageSize,
      offset: (safePage - 1) * safePageSize,
    }),
    SchoolEnquiry.findOne({
      where: baseWhere,
      attributes: [
        [fn('COUNT', col('enquiry_id')), 'total'],
        [fn('COUNT', literal(`CASE WHEN UPPER(COALESCE("SchoolEnquiry"."status", '')) = 'REGISTERED' THEN 1 END`)), 'registered'],
        [fn('COUNT', literal(`CASE WHEN UPPER(COALESCE("SchoolEnquiry"."status", '')) = 'CANCELLED' THEN 1 END`)), 'cancelled'],
      ],
      raw: true,
    }),
  ]);

  return {
    rows,
    page: safePage,
    pageSize: safePageSize,
    total: count,
    counters: {
      total: Number(counters?.total ?? 0),
      registered: Number(counters?.registered ?? 0),
      cancelled: Number(counters?.cancelled ?? 0),
    },
  };
};

module.exports = {
  searchRegistrationsRepo,
  listRegistrationsRepo,
};
