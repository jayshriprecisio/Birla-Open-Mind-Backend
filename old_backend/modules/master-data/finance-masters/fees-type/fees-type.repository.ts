import { pool } from '@/backend/config/db';

export type FeesTypeRow = {
  id: string;
  fees_type_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createFeesTypeRepo = async ({
  feesTypeName,
  status,
  createdBy,
}: {
  feesTypeName: string;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO fees_type_master
      (fees_type_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      fees_type_name,
      status,
      created_at,
      updated_at
    `,
    [feesTypeName, status, createdBy]
  );
};

export type ListFeesTypeFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM fees_type_master
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
      OR fees_type_name ILIKE $${i}
      OR status ILIKE $${i}
      OR ('FT-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countFeesTypesRepo = async (
  filters: Omit<ListFeesTypeFilters, 'limit' | 'offset'>
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

export const listFeesTypesPaginatedRepo = async (
  filters: ListFeesTypeFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<FeesTypeRow>(
    `
    SELECT
      id::text,
      fees_type_name,
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

export const existsFeesTypeNameRepo = async ({
  feesTypeName,
  excludeId,
}: {
  feesTypeName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM fees_type_master
    WHERE LOWER(fees_type_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [feesTypeName, excludeId ?? null]
  );
};

export const updateFeesTypeRepo = async ({
  id,
  feesTypeName,
  status,
}: {
  id: string | number;
  feesTypeName?: string;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE fees_type_master
    SET
      fees_type_name = COALESCE($2, fees_type_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      fees_type_name,
      status,
      created_at,
      updated_at
    `,
    [id, feesTypeName ?? null, status ?? null]
  );
};

export const softDeleteFeesTypeByIdRepo = async (
  id: string | number
) => {
  return pool.query(
    `
    UPDATE fees_type_master
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
