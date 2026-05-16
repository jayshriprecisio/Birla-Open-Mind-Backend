const { 
  SchoolEnquiry, 
  SchoolEnquirySibling, 
  SchoolEnquiryFollowup, 
  School, 
  GradeMaster, 
  SourceMaster,
  User, 
  sequelize 
} = require('../models');
const { roleNamesToIds } = require('../utils/roles');
const { Op } = require('sequelize');
const { detectSource } = require('../utils/utm');

const findAdmissionInquiryByPhoneRepo = async (phone) => {
  const sql = `
    SELECT
      ai.id::text AS id,
      ai.school_id::text AS school_id,
      ai.phone_number,
      s.school_name AS school,
      COALESCE(b.name, s.brand_code, '') AS brand_name,
      z.zone_name,
      s.board,
      ai.grade_id::text AS grade_id,
      g.short_form AS grade_short_form,
      g.name AS grade,
      ai.parent_first_name,
      ai.parent_last_name,
      ai.email,
      ai.comment,
      ai.status,
      ai.created_at
     FROM admission_inquiry ai
     LEFT JOIN schools s ON ai.school_id::text = s.school_id::text AND s.deleted_at IS NULL
     LEFT JOIN brand_master b ON b.id::text = s.brand_id::text
     LEFT JOIN zone_master z ON z.id::text = s.zone_id::text
     LEFT JOIN grade_master g ON ai.grade_id::text = g.id::text AND COALESCE(g.is_deleted, FALSE) = FALSE
     WHERE REGEXP_REPLACE(COALESCE(ai.phone_number, ''), '[^0-9]', '', 'g')
       = REGEXP_REPLACE($1, '[^0-9]', '', 'g')
     ORDER BY ai.created_at DESC
     LIMIT 1`;
  
  const [results] = await sequelize.query(sql, { bind: [phone] });
  return { rows: results };
};

const getRoundRobinCandidateUsers = async (transaction) => {
  const allowedRoleIds = roleNamesToIds(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  return User.findAll({
    where: {
      is_active: true,
      role: { [Op.in]: allowedRoleIds }
    },
    order: [['id', 'ASC']],
    transaction
  });
};

const nextAssignee = async (transaction) => {
  const users = await getRoundRobinCandidateUsers(transaction);
  if (!users.length) return { assigned_to: null, current_owner: null };

  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS school_enquiry_assignment_cursor (
      id SMALLINT PRIMARY KEY DEFAULT 1,
      next_index INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    { transaction }
  );

  await sequelize.query(
    `INSERT INTO school_enquiry_assignment_cursor (id, next_index)
     VALUES (1, 0)
     ON CONFLICT (id) DO NOTHING`,
    { transaction }
  );

  const [cursorResult] = await sequelize.query(
    `SELECT next_index FROM school_enquiry_assignment_cursor WHERE id = 1 FOR UPDATE`,
    { transaction }
  );
  
  const currentIndex = Number(cursorResult[0]?.next_index ?? 0);
  const idx = ((currentIndex % users.length) + users.length) % users.length;
  const picked = users[idx];
  const nextIndex = (idx + 1) % users.length;
  
  await sequelize.query(
    `UPDATE school_enquiry_assignment_cursor SET next_index = $1, updated_at = NOW() WHERE id = 1`,
    { bind: [nextIndex], transaction }
  );

  return {
    assigned_to: Number(picked.id),
    current_owner: picked.full_name,
  };
};

const generateEnquiryNo = () =>
  `ENQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

const createSchoolEnquiryRepo = async ({ userId, payload }) => {
  const transaction = await sequelize.transaction();
  try {
    const rr = await nextAssignee(transaction);
    const enquiryNo = generateEnquiryNo();

    const sourceName = detectSource(payload, 'Manual');
    const source = await SourceMaster.findOne({
      where: { name: sourceName, is_deleted: false },
      transaction
    });

    const enquiry = await SchoolEnquiry.create({
      ...payload,
      enquiry_no: enquiryNo,
      source_id: source?.id || payload.source_id || null,
      current_owner: rr.current_owner,
      assigned_to: rr.assigned_to,
      created_by: userId,
      updated_by: userId
    }, { transaction });

    const [idMeta] = await sequelize.query(
      `SELECT is_identity FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = 'school_enquiry_siblings' AND column_name = 'sibling_id' LIMIT 1`,
      { transaction }
    );
    const isIdentity = idMeta[0]?.is_identity === 'YES';

    if (!isIdentity) {
      await sequelize.query(`CREATE SEQUENCE IF NOT EXISTS school_enquiry_siblings_sibling_id_seq`, { transaction });
      await sequelize.query(
        `SELECT setval('school_enquiry_siblings_sibling_id_seq', COALESCE((SELECT MAX(sibling_id) FROM school_enquiry_siblings), 0) + 1, FALSE)`,
        { transaction }
      );
      await sequelize.query(
        `ALTER TABLE school_enquiry_siblings ALTER COLUMN sibling_id SET DEFAULT nextval('school_enquiry_siblings_sibling_id_seq')`,
        { transaction }
      );
    }

    if (payload.siblings && payload.siblings.length > 0) {
      const siblingsData = payload.siblings.map(s => ({
        ...s,
        enquiry_id: enquiry.enquiry_id
      }));
      await SchoolEnquirySibling.bulkCreate(siblingsData, { transaction });
    }

    if (payload.followup) {
      await SchoolEnquiryFollowup.create({
        ...payload.followup,
        enquiry_id: enquiry.enquiry_id,
        followup_by: userId
      }, { transaction });
    }

    await transaction.commit();
    return enquiry;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateSchoolEnquiryStatusRepo = async (enquiryId, status, userId) => {
  const enquiry = await SchoolEnquiry.findByPk(enquiryId);
  if (enquiry) {
    enquiry.status = status;
    enquiry.updated_by = userId;
    await enquiry.save();
    return enquiry;
  }
  return null;
};

const softDeleteSchoolEnquiryRepo = async (enquiryId, userId) => {
  const enquiry = await SchoolEnquiry.findByPk(enquiryId);
  if (enquiry) {
    enquiry.is_deleted = true;
    enquiry.updated_by = userId;
    await enquiry.save();
    return enquiry;
  }
  return null;
};

const listSchoolEnquiriesFilteredRepo = async (filters) => {
  const where = { is_deleted: false };
  
  if (filters.search) {
    where[Op.or] = [
      { student_name: { [Op.iLike]: `%${filters.search}%` } },
      { enquiry_no: { [Op.iLike]: `%${filters.search}%` } },
      { father_name: { [Op.iLike]: `%${filters.search}%` } }
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  const { count, rows } = await SchoolEnquiry.findAndCountAll({
    where,
    include: [
      { model: School, as: 'school', attributes: ['school_name'] },
      { model: GradeMaster, as: 'grade', attributes: ['name'] },
      { model: SourceMaster, as: 'source_ref', attributes: ['name'] },
      { model: User, as: 'counsellor', attributes: ['full_name'] }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(filters.pageSize || 10, 10),
    offset: (parseInt(filters.page || 1, 10) - 1) * parseInt(filters.pageSize || 10, 10),
    distinct: true
  });

  const flattenedRows = rows.map(r => {
    const json = r.toJSON();
    return {
      ...json,
      grade: json.grade?.name || '',
      school: json.school?.school_name || '',
      source_name: json.source_ref?.name || 'Manual',
      counsellor_name: json.counsellor?.full_name || 'Not Assigned'
    };
  });

  const [schools, grades, sources, counsellors] = await Promise.all([
    School.findAll({ attributes: ['school_name'], where: { deleted_at: null }, group: ['school_name'], order: [['school_name', 'ASC']] }),
    GradeMaster.findAll({ attributes: ['name'], where: { is_deleted: false }, group: ['name'], order: [['name', 'ASC']] }),
    SourceMaster.findAll({ attributes: ['name'], where: { is_deleted: false }, order: [['display_order', 'ASC']] }),
    User.findAll({ attributes: ['full_name'], where: { is_active: true, role: roleNamesToIds(['school']) }, order: [['full_name', 'ASC']] })
  ]);

  return {
    total: count,
    rows: flattenedRows,
    items: flattenedRows,
    options: {
      schools: schools.map(s => s.school_name),
      grades: grades.map(g => g.name),
      sources: sources.map(s => s.name),
      counsellors: counsellors.map(c => c.full_name),
      statuses: ['NEW', 'CONTACTED', 'INTERESTED', 'SITE VISIT', 'APPLICATION', 'ENROLLED', 'LOST'],
      priorities: ['HOT', 'WARM', 'COLD']
    },
    page: parseInt(filters.page || 1, 10),
    pageSize: parseInt(filters.pageSize || 10, 10),
  };
};

module.exports = {
  findAdmissionInquiryByPhoneRepo,
  createSchoolEnquiryRepo,
  updateSchoolEnquiryStatusRepo,
  softDeleteSchoolEnquiryRepo,
  listSchoolEnquiriesFilteredRepo,
};
