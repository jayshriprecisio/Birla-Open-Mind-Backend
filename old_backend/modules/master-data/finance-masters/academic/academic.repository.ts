import { pool } from '@/backend/config/db';

export type AcademicRow = {
  id: string;
  academic_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createAcademicRepo = async ({
  academicName,
  status,
  createdBy,
}: {
  academicName: string;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO academic_master
      (academic_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      academic_name,
      status,
      created_at,
      updated_at
    `,
    [academicName, status, createdBy]
  );
};

export type ListAcademicFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM academic_master
  WHERE COALESCE(is_deleted, FALSE) = FALSE
`;

function buildFilterClause(q: string, statusFilter: '' | 'ACTIVE' | 'INACTIVE') {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (statusFilter) {
    conditions.push(`status = $${i}`);
    params.push(statusFilter);
    i += 1;
  }

  const trimmed = q.trim();
  if (trimmed) {
    conditions.push(`(
      CAST(id AS TEXT) ILIKE $${i}
      OR academic_name ILIKE $${i}
      OR status ILIKE $${i}
      OR ('AC-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countAcademicsRepo = async (
  filters: Omit<ListAcademicFilters, 'limit' | 'offset'>
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const res = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count ${baseWhere} ${whereExtra}`,
    params
  );
  return Number(res.rows[0]?.count ?? 0);
};

export const listAcademicsPaginatedRepo = async (
  filters: ListAcademicFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<AcademicRow>(
    `
    SELECT
      id::text,
      academic_name,
      status,
      created_at,
      updated_at
    ${baseWhere}
    ${whereExtra}
    ORDER BY id ASC
    LIMIT $${limitParam} OFFSET $${offsetParam}
    `,
    [...params, filters.limit, filters.offset]
  );
};

export const existsAcademicNameRepo = async ({
  academicName,
  excludeId,
}: {
  academicName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM academic_master
    WHERE LOWER(academic_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [academicName, excludeId ?? null]
  );
};

export const updateAcademicRepo = async ({
  id,
  academicName,
  status,
}: {
  id: string | number;
  academicName?: string;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE academic_master
    SET
      academic_name = COALESCE($2, academic_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      academic_name,
      status,
      created_at,
      updated_at
    `,
    [id, academicName ?? null, status ?? null]
  );
};

export const softDeleteAcademicByIdRepo = async (
  id: string | number
) => {
  return pool.query(
    `
    UPDATE academic_master
    SET
      is_deleted = TRUE,
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id]
  );
};
