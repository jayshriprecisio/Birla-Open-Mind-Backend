const { pool } = require('../../../config/db');

const baseSelect = `
  SELECT
    se.enquiry_id::text                                AS enquiry_id,
    se.enquiry_no                                      AS enquiry_no,
    se.enquiry_no                                      AS registration_no,
    se.student_name                                    AS student_name,
    COALESCE(
      NULLIF(TRIM(se.father_name), ''),
      NULLIF(TRIM(se.mother_name), ''),
      NULLIF(TRIM(se.guardian_name), '')
    )                                                  AS parent_name,
    se.father_name                                     AS father_name,
    se.father_mobile                                   AS father_mobile,
    se.father_email                                    AS father_email,
    se.mother_name                                     AS mother_name,
    se.mother_mobile                                   AS mother_mobile,
    se.mother_email                                    AS mother_email,
    se.guardian_name                                   AS guardian_name,
    se.guardian_mobile                                 AS guardian_mobile,
    COALESCE(
      NULLIF(TRIM(se.father_mobile), ''),
      NULLIF(TRIM(se.mother_mobile), ''),
      NULLIF(TRIM(se.guardian_mobile), '')
    )                                                  AS mobile,
    se.dob                                             AS dob,
    se.aadhaar_no                                      AS aadhaar_no,
    se.address_line1                                   AS address_line1,
    se.address_line2                                   AS address_line2,
    se.address_line3                                   AS address_line3,
    se.pincode                                         AS pincode,
    se.country                                         AS country,
    se.state                                           AS state,
    se.city                                            AS city,
    se.school_id::text                                 AS school_id,
    COALESCE(sc.school_name, '')                       AS school,
    se.grade_id::text                                  AS grade_id,
    COALESCE(gm.short_form, gm.name, '')               AS grade,
    se.board_id::text                                  AS board_id,
    COALESCE(bm.name, '')                              AS board,
    se.status                                          AS status,
    se.created_at                                      AS reg_date,
    se.created_at                                      AS created_at,
    se.updated_at                                      AS updated_at
  FROM school_enquiries se
  LEFT JOIN schools sc
    ON sc.school_id::text = se.school_id::text
   AND sc.deleted_at IS NULL
  LEFT JOIN grade_master gm
    ON gm.id = se.grade_id
   AND COALESCE(gm.is_deleted, FALSE) = FALSE
  LEFT JOIN board_master bm
    ON bm.id = se.board_id
`;

const normalizePhone = (v) =>
  String(v ?? '').replace(/[^0-9]/g, '');

const isFilled = (v) => v !== undefined && v !== null && String(v).trim() !== '';

const searchRegistrationsRepo = async ({ enquiry_no, phone }) => {
  const clauses = ['COALESCE(se.is_deleted, FALSE) = FALSE'];
  const params = [];
  let idx = 1;

  if (isFilled(enquiry_no)) {
    clauses.push(`UPPER(TRIM(se.enquiry_no)) = UPPER(TRIM($${idx}))`);
    params.push(String(enquiry_no).trim());
    idx += 1;
  }

  if (isFilled(phone)) {
    const cleaned = normalizePhone(phone);
    clauses.push(`(
      REGEXP_REPLACE(COALESCE(se.father_mobile, ''),   '[^0-9]', '', 'g') = $${idx}
      OR REGEXP_REPLACE(COALESCE(se.mother_mobile, ''),   '[^0-9]', '', 'g') = $${idx}
      OR REGEXP_REPLACE(COALESCE(se.guardian_mobile, ''), '[^0-9]', '', 'g') = $${idx}
    )`);
    params.push(cleaned);
    idx += 1;
  }

  const sql = `
    ${baseSelect}
    WHERE ${clauses.join(' AND ')}
    ORDER BY se.created_at DESC
    LIMIT 50
  `;

  const result = await pool.query(sql, params);
  return result.rows;
};

const getRegistrationByEnquiryIdRepo = async (enquiryId) => {
  const sql = `
    ${baseSelect}
    WHERE COALESCE(se.is_deleted, FALSE) = FALSE
      AND se.enquiry_id = $1::uuid
    LIMIT 1
  `;
  const result = await pool.query(sql, [enquiryId]);
  return result.rows[0] || null;
};

const listRegistrationsRepo = async ({ search, status, page = 1, pageSize = 50 }) => {
  const clauses = ['COALESCE(se.is_deleted, FALSE) = FALSE'];
  const params = [];
  let idx = 1;

  if (isFilled(search)) {
    const needle = `%${String(search).trim()}%`;
    clauses.push(`(
         COALESCE(se.enquiry_no, '')      ILIKE $${idx}
      OR COALESCE(se.student_name, '')    ILIKE $${idx}
      OR COALESCE(se.father_name, '')     ILIKE $${idx}
      OR COALESCE(se.mother_name, '')     ILIKE $${idx}
      OR COALESCE(se.guardian_name, '')   ILIKE $${idx}
      OR COALESCE(se.father_mobile, '')   ILIKE $${idx}
      OR COALESCE(se.mother_mobile, '')   ILIKE $${idx}
      OR COALESCE(se.guardian_mobile, '') ILIKE $${idx}
      OR COALESCE(sc.school_name, '')     ILIKE $${idx}
    )`);
    params.push(needle);
    idx += 1;
  }

  if (isFilled(status) && String(status).toUpperCase() !== 'ALL') {
    clauses.push(`UPPER(COALESCE(se.status, '')) = UPPER($${idx})`);
    params.push(String(status).trim());
    idx += 1;
  }

  const whereSql = `WHERE ${clauses.join(' AND ')}`;
  const safePageSize = Math.max(1, Math.min(Number(pageSize) || 50, 200));
  const safePage = Math.max(1, Number(page) || 1);
  const offset = (safePage - 1) * safePageSize;

  const dataSql = `
    ${baseSelect}
    ${whereSql}
    ORDER BY se.created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  const dataParams = [...params, safePageSize, offset];

  const countSql = `
    SELECT
      COUNT(*)::int                                                        AS total,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(se.status, '')) = 'REGISTERED')::int AS registered,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(se.status, '')) = 'CANCELLED')::int  AS cancelled
    FROM school_enquiries se
    LEFT JOIN schools sc
      ON sc.school_id::text = se.school_id::text
     AND sc.deleted_at IS NULL
    ${whereSql}
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataSql, dataParams),
    pool.query(countSql, params),
  ]);

  const counters = countResult.rows[0] || { total: 0, registered: 0, cancelled: 0 };

  return {
    rows: dataResult.rows,
    page: safePage,
    pageSize: safePageSize,
    total: counters.total,
    counters: {
      total: counters.total,
      registered: counters.registered,
      cancelled: counters.cancelled,
    },
  };
};

module.exports = {
  searchRegistrationsRepo,
  getRegistrationByEnquiryIdRepo,
  listRegistrationsRepo,
};
