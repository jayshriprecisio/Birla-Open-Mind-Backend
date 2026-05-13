import { pool } from '@/backend/config/db';

type ListArgs = {
  q: string;
  status: string;
  school: string;
  grade: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  limit: number;
};

/**
 * Historical rows had `[Relation: ... | School: ... | Grade: ...]` appended to
 * `comment` by an earlier version of the writer. New inserts no longer do
 * that, but this SELECT sanitises old rows on the fly so the UI always shows
 * just the user-entered comment.
 */
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

function buildWhere(args: ListArgs) {
  /** Always exclude soft-deleted rows from any list view. */
  const clauses: string[] = ['COALESCE(ai.is_deleted, FALSE) = FALSE'];
  const values: unknown[] = [];
  let idx = 1;

  const needle = args.q.trim().toLowerCase();
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

export async function listAdmissionInquiriesRepo(args: ListArgs) {
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
    pool.query<{ c: string }>(countSql, values),
    pool.query(dataSql, [...values, args.limit, offset]),
    pool.query<{ school_name: string }>(schoolsSql),
    pool.query<{ grade: string }>(gradesSql),
  ]);

  return {
    rows: dataRes.rows as Array<Record<string, unknown>>,
    total: Number(countRes.rows[0]?.c ?? 0),
    schools: schoolRes.rows.map((r) => r.school_name).filter(Boolean),
    grades: gradeRes.rows.map((r) => r.grade).filter(Boolean),
  };
}

export const updateAdmissionInquiryStatusRepo = (id: string | number, status: string) =>
  pool.query(
    `UPDATE admission_inquiry
     SET status = $2
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, status`,
    [id, status]
  );

/**
 * Soft-delete an admission enquiry. Idempotent: if the row is already
 * deleted (or doesn't exist) the query returns 0 rows so the caller can
 * surface a 404.
 *
 * `id` is passed as a string so values beyond `Number.MAX_SAFE_INTEGER`
 * (BIGINT up to 2^63-1) survive without precision loss; Postgres casts
 * via `$1::bigint`.
 */
export async function softDeleteAdmissionInquiryRepo(
  id: string,
  deletedBy: string | null
): Promise<{ id: string } | null> {
  const r = await pool.query<{ id: string }>(
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

export type CreateAdmissionInquiryRow = {
  id: string;
  phone_number: string;
  parent_first_name: string;
  parent_last_name: string;
  email: string;
  comment: string | null;
  status: string;
  created_at: string;
  school_id: string | null;
  grade_id: string | null;
};

interface CreateAdmissionInquiryArgs {
  school: string;
  grade: string;
  parent_first_name: string;
  parent_last_name: string;
  email: string;
  phone_number: string;
  comment?: string;
  relation?: string;
}

async function resolveSchoolId(client: typeof pool, name: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const r = await client.query<{ school_id: string }>(
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

async function resolveGradeId(client: typeof pool, name: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const r = await client.query<{ id: string }>(
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

/**
 * Insert a public admission enquiry.
 *
 * The form sends `school` and `grade` as text; we persist both the text
 * (in `school` / `grade` columns for human display) and the resolved FK
 * (`school_id` / `grade_id` for joins). The relation is stored in its own
 * `relation` column. The user's `comment` is stored verbatim — no
 * metadata is appended.
 */
export async function createAdmissionInquiryRepo(
  args: CreateAdmissionInquiryArgs
): Promise<CreateAdmissionInquiryRow> {
  const [schoolId, gradeId] = await Promise.all([
    resolveSchoolId(pool, args.school),
    resolveGradeId(pool, args.grade),
  ]);

  const cleanComment = (args.comment ?? '').trim().slice(0, 2000) || null;
  const relation = (args.relation ?? '').trim() || null;
  const schoolText = (args.school ?? '').trim() || null;
  const gradeText = (args.grade ?? '').trim() || null;

  const res = await pool.query<CreateAdmissionInquiryRow>(
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
