import { pool } from '@/backend/config/db';

export type FeesSubTypeRow = {
  id: string;
  fees_sub_type_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createFeesSubTypeRepo = async ({
  feesSubTypeName,
  status,
  createdBy,
}: {
  feesSubTypeName: string;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO fees_sub_type_master
      (fees_sub_type_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      fees_sub_type_name,
      status,
      created_at,
      updated_at
    `,
    [feesSubTypeName, status, createdBy]
  );
};

export type ListFeesSubTypeFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM fees_sub_type_master
  WHERE COALESCE(is_deleted, FALSE) = FALSE
`;

function buildFilterClause(
  q: string,
  statusFilter: '' | 'ACTIVE' | 'INACTIVE'
) {
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
      OR fees_sub_type_name ILIKE $${i}
      OR status ILIKE $${i}
      OR ('FST-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countFeesSubTypesRepo = async (
  filters: Omit<ListFeesSubTypeFilters, 'limit' | 'offset'>
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

export const listFeesSubTypesPaginatedRepo = async (
  filters: ListFeesSubTypeFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<FeesSubTypeRow>(
    `
    SELECT
      id::text,
      fees_sub_type_name,
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

export const existsFeesSubTypeNameRepo = async ({
  feesSubTypeName,
  excludeId,
}: {
  feesSubTypeName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM fees_sub_type_master
    WHERE LOWER(fees_sub_type_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [feesSubTypeName, excludeId ?? null]
  );
};

export const updateFeesSubTypeRepo = async ({
  id,
  feesSubTypeName,
  status,
}: {
  id: string | number;
  feesSubTypeName?: string;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE fees_sub_type_master
    SET
      fees_sub_type_name = COALESCE($2, fees_sub_type_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      fees_sub_type_name,
      status,
      created_at,
      updated_at
    `,
    [id, feesSubTypeName ?? null, status ?? null]
  );
};

export const softDeleteFeesSubTypeByIdRepo = async (
  id: string | number
) => {
  return pool.query(
    `
    UPDATE fees_sub_type_master
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
