const { pool } = require('../../../config/db');

const baseSelect = `
  SELECT
    ai.id::text AS id,
    ai.phone_number,
    ai.parent_first_name,
    ai.parent_last_name,
    ai.email,
    NULLIF(
      TRIM(REGEXP_REPLACE(
        COALESCE(ai.comment, ''),
        E'\\\\s*\\\\[Relation:[^\\\\]]*\\\\]\\\\s*',
        '',
        'g'
      )),
      ''
    ) AS comment,
    ai.status,
    ai.created_at,
    COALESCE(s.school_name, '') AS school_name,
    COALESCE(g.short_form, g.name, '') AS grade
  FROM admission_inquiry ai
  LEFT JOIN schools s
    ON NULLIF(TRIM(COALESCE(ai.school_id::text, '')), '') = s.school_id::text
   AND s.deleted_at IS NULL
  LEFT JOIN grade_master g
    ON NULLIF(TRIM(COALESCE(ai.grade_id::text, '')), '') = g.id::text
   AND COALESCE(g.is_deleted, FALSE) = FALSE
`;

function buildWhere(args) {
  const clauses = ['COALESCE(ai.is_deleted, FALSE) = FALSE'];
  const values = [];
  let idx = 1;

  const needle = (args.q || '').trim().toLowerCase();
  if (needle) {
    clauses.push(`(
      position($${idx} in lower(COALESCE(ai.parent_first_name, ''))) > 0 OR
      position($${idx} in lower(COALESCE(ai.parent_last_name, ''))) > 0 OR
      position($${idx} in lower(COALESCE(ai.email, ''))) > 0 OR
      position($${idx} in lower(COALESCE(ai.phone_number, ''))) > 0 OR
      position($${idx} in lower(COALESCE(s.school_name, ''))) > 0
    )`);
    values.push(needle);
    idx += 1;
  }

  if (args.status && args.status.toUpperCase() !== 'ALL') {
    clauses.push(`upper(COALESCE(ai.status, 'NEW')) = upper($${idx})`);
    values.push(args.status);
    idx += 1;
  }

  if (args.school && args.school.toUpperCase() !== 'ALL') {
    clauses.push(`COALESCE(s.school_name, '') = $${idx}`);
    values.push(args.school);
    idx += 1;
  }

  if (args.grade && args.grade.toUpperCase() !== 'ALL') {
    clauses.push(`COALESCE(g.short_form, g.name, '') = $${idx}`);
    values.push(args.grade);
    idx += 1;
  }

  if (args.dateFrom) {
    clauses.push(`ai.created_at::date >= $${idx}::date`);
    values.push(args.dateFrom);
    idx += 1;
  }

  if (args.dateTo) {
    clauses.push(`ai.created_at::date <= $${idx}::date`);
    values.push(args.dateTo);
    idx += 1;
  }

  return {
    whereSql: `WHERE ${clauses.join(' AND ')}`,
    values,
  };
}

async function listAdmissionInquiriesRepo(args) {
  const { whereSql, values } = buildWhere(args);
  const offset = (args.page - 1) * args.limit;

  const countSql = `
    SELECT COUNT(*)::bigint AS c
    FROM admission_inquiry ai
    LEFT JOIN schools s
      ON NULLIF(TRIM(COALESCE(ai.school_id::text, '')), '') = s.school_id::text
     AND s.deleted_at IS NULL
    ${whereSql}
  `;

  const dataSql = `
    ${baseSelect}
    ${whereSql}
    ORDER BY ai.created_at DESC, ai.id DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const schoolsSql = `
    SELECT DISTINCT COALESCE(s.school_name, '') AS school_name
    FROM admission_inquiry ai
    LEFT JOIN schools s
      ON NULLIF(TRIM(COALESCE(ai.school_id::text, '')), '') = s.school_id::text
     AND s.deleted_at IS NULL
    WHERE COALESCE(ai.is_deleted, FALSE) = FALSE
      AND COALESCE(s.school_name, '') <> ''
    ORDER BY school_name ASC
    LIMIT 500
  `;
  const gradesSql = `
    SELECT DISTINCT COALESCE(g.short_form, g.name, '') AS grade
    FROM admission_inquiry ai
    LEFT JOIN grade_master g
      ON NULLIF(TRIM(COALESCE(ai.grade_id::text, '')), '') = g.id::text
     AND COALESCE(g.is_deleted, FALSE) = FALSE
    WHERE COALESCE(ai.is_deleted, FALSE) = FALSE
      AND COALESCE(g.short_form, g.name, '') <> ''
    ORDER BY grade ASC
    LIMIT 500
  `;

  const [countRes, dataRes, schoolRes, gradeRes] = await Promise.all([
    pool.query(countSql, values),
    pool.query(dataSql, [...values, args.limit, offset]),
    pool.query(schoolsSql),
    pool.query(gradesSql),
  ]);

  return {
    rows: dataRes.rows,
    total: Number(countRes.rows[0]?.c ?? 0),
    schools: schoolRes.rows.map((r) => r.school_name).filter(Boolean),
    grades: gradeRes.rows.map((r) => r.grade).filter(Boolean),
  };
}

const updateAdmissionInquiryStatusRepo = (id, status) =>
  pool.query(
    `UPDATE admission_inquiry
     SET status = $2
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, status`,
    [id, status]
  );

async function softDeleteAdmissionInquiryRepo(id, deletedBy) {
  const r = await pool.query(
    `UPDATE admission_inquiry
        SET is_deleted = TRUE,
            deleted_at = NOW(),
            deleted_by = $2
      WHERE id = $1::bigint
        AND COALESCE(is_deleted, FALSE) = FALSE
      RETURNING id::text AS id`,
    [id, deletedBy]
  );
  return r.rows[0] ?? null;
}

async function resolveSchoolId(client, name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return null;
  const r = await client.query(
    `SELECT school_id::text AS school_id
       FROM schools
      WHERE deleted_at IS NULL
        AND (
              LOWER(school_name) = LOWER($1)
           OR LOWER(school_code) = LOWER($1)
           OR LOWER(brand_code)  = LOWER($1)
        )
      ORDER BY created_at DESC NULLS LAST
      LIMIT 1`,
    [trimmed]
  );
  return r.rows[0]?.school_id ?? null;
}

async function resolveGradeId(client, name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return null;
  const r = await client.query(
    `SELECT id::text AS id
       FROM grade_master
      WHERE COALESCE(is_deleted, FALSE) = FALSE
        AND (
              LOWER(name) = LOWER($1)
           OR LOWER(short_form) = LOWER($1)
        )
      ORDER BY id ASC
      LIMIT 1`,
    [trimmed]
  );
  return r.rows[0]?.id ?? null;
}

async function createAdmissionInquiryRepo(args) {
  const [schoolId, gradeId] = await Promise.all([
    resolveSchoolId(pool, args.school),
    resolveGradeId(pool, args.grade),
  ]);

  const cleanComment = (args.comment ?? '').trim().slice(0, 2000) || null;
  const relation = (args.relation ?? '').trim() || null;
  const schoolText = (args.school ?? '').trim() || null;
  const gradeText = (args.grade ?? '').trim() || null;

  const res = await pool.query(
    `INSERT INTO admission_inquiry (
        phone_number,
        parent_first_name,
        parent_last_name,
        email,
        comment,
        status,
        school,
        grade,
        relation,
        school_id,
        grade_id
     ) VALUES (
        $1, $2, $3, $4, $5, 'NEW',
        $6, $7, $8,
        NULLIF($9, '')::uuid,
        NULLIF($10, '')::bigint
     )
     RETURNING
        id::text AS id,
        phone_number,
        parent_first_name,
        parent_last_name,
        email,
        comment,
        status,
        created_at,
        school_id::text AS school_id,
        grade_id::text AS grade_id`,
    [
      args.phone_number,
      args.parent_first_name,
      args.parent_last_name,
      args.email,
      cleanComment,
      schoolText,
      gradeText,
      relation,
      schoolId ?? '',
      gradeId ?? '',
    ]
  );
  return res.rows[0];
}

module.exports = {
  listAdmissionInquiriesRepo,
  updateAdmissionInquiryStatusRepo,
  softDeleteAdmissionInquiryRepo,
  createAdmissionInquiryRepo,
};
