import { pool } from '@/backend/config/db';

export type FeesCategoryRow = {
  id: string;
  fees_category_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createFeesCategoryRepo = async ({
  feesCategoryName,
  status,
  createdBy,
}: {
  feesCategoryName: string;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO fees_category_master
      (fees_category_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      fees_category_name,
      status,
      created_at,
      updated_at
    `,
    [feesCategoryName, status, createdBy]
  );
};

export type ListFeesCategoryFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM fees_category_master
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
      OR fees_category_name ILIKE $${i}
      OR status ILIKE $${i}
      OR ('FC-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countFeesCategoriesRepo = async (
  filters: Omit<ListFeesCategoryFilters, 'limit' | 'offset'>
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

export const listFeesCategoriesPaginatedRepo = async (
  filters: ListFeesCategoryFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<FeesCategoryRow>(
    `
    SELECT
      id::text,
      fees_category_name,
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

export const existsFeesCategoryNameRepo = async ({
  feesCategoryName,
  excludeId,
}: {
  feesCategoryName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM fees_category_master
    WHERE LOWER(fees_category_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [feesCategoryName, excludeId ?? null]
  );
};

export const updateFeesCategoryRepo = async ({
  id,
  feesCategoryName,
  status,
}: {
  id: string | number;
  feesCategoryName?: string;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE fees_category_master
    SET
      fees_category_name = COALESCE($2, fees_category_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      fees_category_name,
      status,
      created_at,
      updated_at
    `,
    [id, feesCategoryName ?? null, status ?? null]
  );
};

export const softDeleteFeesCategoryByIdRepo = async (
  id: string | number
) => {
  return pool.query(
    `
    UPDATE fees_category_master
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
