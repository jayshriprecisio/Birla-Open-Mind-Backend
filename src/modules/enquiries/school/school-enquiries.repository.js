const { pool } = require('../../../config/db');
const { roleNamesToIds } = require('../../../utils/roles');

const DEFAULT_MASTER_ID = 1;
const DEFAULT_SCHOOL_UUID = '00000000-0000-0000-0000-000000000001';

const findAdmissionInquiryByPhoneRepo = (phone) =>
  pool.query(
    `SELECT
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
     LEFT JOIN schools s
       ON NULLIF(TRIM(COALESCE(ai.school_id::text, '')), '') = s.school_id::text
      AND s.deleted_at IS NULL
     LEFT JOIN brand_master b
       ON b.id::text = NULLIF(TRIM(COALESCE(s.brand_id::text, '')), '')
     LEFT JOIN zone_master z
       ON z.id::text = NULLIF(TRIM(COALESCE(s.zone_id::text, '')), '')
     LEFT JOIN grade_master g
       ON NULLIF(TRIM(COALESCE(ai.grade_id::text, '')), '') = g.id::text
      AND COALESCE(g.is_deleted, FALSE) = FALSE
     WHERE REGEXP_REPLACE(COALESCE(ai.phone_number, ''), '[^0-9]', '', 'g')
       = REGEXP_REPLACE($1, '[^0-9]', '', 'g')
     ORDER BY ai.created_at DESC
     LIMIT 1`,
    [phone]
  );

const getRoundRobinCandidateUsers = async (client) => {
  const allowedRoleIds = roleNamesToIds(['SUPER_ADMIN', 'SCHOOL_ADMIN']);
  const result = await client.query(
    `SELECT id::text AS id, full_name
     FROM users
     WHERE COALESCE(is_active, TRUE) = TRUE
       AND role = ANY($1::bigint[])
     ORDER BY id ASC`,
    [allowedRoleIds]
  );
  return result.rows;
};

const nextAssignee = async (client) => {
  const users = await getRoundRobinCandidateUsers(client);
  if (!users.length) return { assigned_to: null, current_owner: null };

  await client.query(
    `CREATE TABLE IF NOT EXISTS school_enquiry_assignment_cursor (
      id SMALLINT PRIMARY KEY DEFAULT 1,
      next_index INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  );

  await client.query(
    `INSERT INTO school_enquiry_assignment_cursor (id, next_index)
     VALUES (1, 0)
     ON CONFLICT (id) DO NOTHING`
  );

  const cursorResult = await client.query(
    `SELECT next_index
     FROM school_enquiry_assignment_cursor
     WHERE id = 1
     FOR UPDATE`
  );
  const currentIndex = Number(cursorResult.rows[0]?.next_index ?? 0);
  const idx = ((currentIndex % users.length) + users.length) % users.length;
  const picked = users[idx];
  const nextIndex = (idx + 1) % users.length;
  await client.query(
    `UPDATE school_enquiry_assignment_cursor
     SET next_index = $1, updated_at = NOW()
     WHERE id = 1`,
    [nextIndex]
  );

  const assignedNumeric = Number(picked.id);
  return {
    assigned_to: Number.isFinite(assignedNumeric) ? assignedNumeric : null,
    current_owner: picked.full_name ?? null,
  };
};

const normalizedDate = (v) => {
  const s = String(v ?? '').trim();
  return s.length ? s : null;
};

const normalizeText = (v) => {
  const s = String(v ?? '').trim();
  return s.length ? s : null;
};

const asBool = (v) => (v === true || String(v).toLowerCase() === 'true');

const asId = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MASTER_ID;
};

const generateEnquiryNo = () =>
  `ENQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

const toUuidOrNull = (v) => {
  const s = String(v ?? '').trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
    ? s
    : null;
};

const createSchoolEnquiryRepo = async ({ userId, payload }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const rr = await nextAssignee(client);
    const enquiryNo = generateEnquiryNo();
    const actorUuid = toUuidOrNull(userId);

    const insertResult = await client.query(
      `INSERT INTO school_enquiries (
        school_id, branch_id, enquiry_no,
        enquiry_purpose_id, enquiry_for_id, academic_session_id, board_id, grade_id, batch_id,
        school_type_id, source_id, sub_source_id, lead_stage_id, contact_mode_id,
        student_name, dob, gender_id, aadhaar_no, current_school, current_board_id, current_grade_id,
        father_name, father_mobile, father_email, mother_name, mother_mobile, mother_email,
        guardian_name, guardian_mobile, preferred_contact_id,
        address_line1, address_line2, address_line3, pincode, country, state, city,
        is_concession, concession_type_id, is_referral, referral_name,
        current_owner, assigned_to, interaction_mode_id, interaction_status_id,
        next_followup_date, priority_tag, status, created_by, updated_by, is_deleted
      ) VALUES (
        $1::uuid, $2, $3,
        $4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
        $15,$16::date,$17,$18,$19,$20,$21,
        $22,$23,$24,$25,$26,$27,
        $28,$29,$30,
        $31,$32,$33,$34,$35,$36,$37,
        $38,$39,$40,$41,
        $42,$43,$44,$45,
        $46::date,$47,$48,$49::uuid,$50::uuid,FALSE
      )
      RETURNING enquiry_id::text AS enquiry_id, enquiry_no, current_owner, assigned_to, status, created_at`,
      [
        normalizeText(payload.school_id) ?? DEFAULT_SCHOOL_UUID,
        Number(payload.branch_id ?? 1),
        enquiryNo,
        asId(payload.enquiry_purpose_id),
        asId(payload.enquiry_for_id),
        asId(payload.academic_session_id),
        asId(payload.board_id),
        asId(payload.grade_id),
        asId(payload.batch_id),
        asId(payload.school_type_id),
        asId(payload.source_id),
        asId(payload.sub_source_id),
        asId(payload.lead_stage_id),
        asId(payload.contact_mode_id),
        normalizeText(payload.student_name),
        normalizedDate(payload.dob),
        asId(payload.gender_id),
        normalizeText(payload.aadhaar_no),
        normalizeText(payload.current_school),
        asId(payload.current_board_id),
        asId(payload.current_grade_id),
        normalizeText(payload.father_name),
        normalizeText(payload.father_mobile),
        normalizeText(payload.father_email),
        normalizeText(payload.mother_name),
        normalizeText(payload.mother_mobile),
        normalizeText(payload.mother_email),
        normalizeText(payload.guardian_name),
        normalizeText(payload.guardian_mobile),
        asId(payload.preferred_contact_id),
        normalizeText(payload.address_line1),
        normalizeText(payload.address_line2),
        normalizeText(payload.address_line3),
        normalizeText(payload.pincode),
        normalizeText(payload.country),
        normalizeText(payload.state),
        normalizeText(payload.city),
        asBool(payload.is_concession),
        asId(payload.concession_type_id),
        asBool(payload.is_referral),
        asId(payload.referral_name),
        rr.current_owner,
        rr.assigned_to,
        asId(payload.interaction_mode_id),
        asId(payload.interaction_status_id),
        normalizedDate(payload.next_followup_date),
        normalizeText(payload.priority_tag) ?? 'WARM',
        normalizeText(payload.status) ?? 'NEW',
        actorUuid,
        actorUuid,
      ]
    );
    const enquiryId = insertResult.rows[0].enquiry_id;

    // Handle sibling_id identity discrepancy
    const siblingIdMeta = await client.query(
      `SELECT is_identity
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'school_enquiry_siblings'
         AND column_name = 'sibling_id'
       LIMIT 1`
    );
    const isIdentity = siblingIdMeta.rows[0]?.is_identity === 'YES';

    if (!isIdentity) {
      await client.query(
        `CREATE SEQUENCE IF NOT EXISTS school_enquiry_siblings_sibling_id_seq`
      );
      await client.query(
        `SELECT setval(
           'school_enquiry_siblings_sibling_id_seq',
           COALESCE((SELECT MAX(sibling_id) FROM school_enquiry_siblings), 0) + 1,
           FALSE
         )`
      );
      await client.query(
        `ALTER TABLE school_enquiry_siblings
         ALTER COLUMN sibling_id
         SET DEFAULT nextval('school_enquiry_siblings_sibling_id_seq')`
      );
    }

    const siblings = Array.isArray(payload.siblings) ? payload.siblings : [];
    for (const sibling of siblings) {
      await client.query(
        `INSERT INTO school_enquiry_siblings (
          enquiry_id, sibling_name, enrollment_no, dob, school_name, grade_id, board_id
        ) VALUES ($1::uuid, $2, $3, $4::date, $5, $6, $7)`,
        [
          enquiryId,
          normalizeText(sibling.sibling_name),
          normalizeText(sibling.enrollment_no),
          normalizedDate(sibling.dob),
          normalizeText(sibling.school_name),
          asId(sibling.grade_id),
          asId(sibling.board_id),
        ]
      );
    }

    const followup = payload.followup;
    if (followup) {
      await client.query(
        `INSERT INTO school_enquiry_followups (
          enquiry_id, interaction_mode_id, interaction_status_id,
          followup_date, followup_time, next_followup_date, next_followup_time,
          remarks, notes, followup_with, followup_by
        ) VALUES (
          $1::uuid, $2, $3, $4::date, $5::time, $6::date, $7::time, $8, $9, $10, $11::uuid
        )`,
        [
          enquiryId,
          asId(followup.interaction_mode_id),
          asId(followup.interaction_status_id),
          normalizedDate(followup.followup_date),
          normalizeText(followup.followup_time),
          normalizedDate(followup.next_followup_date),
          normalizedDate(followup.next_followup_time),
          normalizeText(followup.remarks),
          normalizeText(followup.notes),
          normalizeText(followup.followup_with),
          actorUuid,
        ]
      );
    }

    await client.query('COMMIT');
    return insertResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateSchoolEnquiryStatusRepo = async (enquiryId, status, userId) => {
  const actorUuid = toUuidOrNull(userId);
  return pool.query(
    `UPDATE school_enquiries
     SET status = $2, updated_by = $3::uuid, updated_at = NOW()
     WHERE enquiry_id = $1::uuid AND is_deleted = FALSE
     RETURNING enquiry_id, status, updated_at`,
    [enquiryId, status, actorUuid]
  );
};

const softDeleteSchoolEnquiryRepo = async (enquiryId, userId) => {
  const actorUuid = toUuidOrNull(userId);
  return pool.query(
    `UPDATE school_enquiries
     SET is_deleted = TRUE, updated_by = $2::uuid, updated_at = NOW()
     WHERE enquiry_id = $1::uuid AND is_deleted = FALSE
     RETURNING enquiry_id`,
    [enquiryId, actorUuid]
  );
};

const listSchoolEnquiriesFilteredRepo = async (filters) => {
  const conditions = ['e.is_deleted = FALSE'];
  const values = [];
  let i = 1;

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(e.student_name ILIKE $${i} OR e.enquiry_no ILIKE $${i} OR e.father_name ILIKE $${i})`);
    i++;
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`e.status = $${i}`);
    i++;
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = parseInt(filters.pageSize || 10, 10);
  const offset = (parseInt(filters.page || 1, 10) - 1) * limit;

  const countSql = `SELECT COUNT(*)::bigint AS total FROM school_enquiries e ${whereSql}`;
  const dataSql = `
    SELECT e.*, s.school_name, g.name AS grade_name
    FROM school_enquiries e
    LEFT JOIN schools s ON e.school_id::text = s.school_id::text
    LEFT JOIN grade_master g ON e.grade_id::text = g.id::text
    ${whereSql}
    ORDER BY e.created_at DESC
    LIMIT $${i} OFFSET $${i + 1}`;

  const [countResult, dataResult] = await Promise.all([
    pool.query(countSql, values),
    pool.query(dataSql, [...values, limit, offset]),
  ]);

  return {
    total: Number(countResult.rows[0].total),
    items: dataResult.rows,
    page: parseInt(filters.page || 1, 10),
    pageSize: limit,
  };
};

module.exports = {
  findAdmissionInquiryByPhoneRepo,
  createSchoolEnquiryRepo,
  updateSchoolEnquiryStatusRepo,
  softDeleteSchoolEnquiryRepo,
  listSchoolEnquiriesFilteredRepo,
};
