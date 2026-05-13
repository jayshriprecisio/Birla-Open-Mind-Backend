import { pool } from '@/backend/config/db';

export type CalculationBasisRow = {
  id: string;
  calculation_basis_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createCalculationBasisRepo = async ({
  calculationBasisName,
  status,
  createdBy,
}: {
  calculationBasisName: string;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO calculation_basis_master
      (calculation_basis_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      calculation_basis_name,
      status,
      created_at,
      updated_at
    `,
    [calculationBasisName, status, createdBy]
  );
};

export type ListCalculationBasisFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM calculation_basis_master
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
      OR calculation_basis_name ILIKE $${i}
      OR status ILIKE $${i}
      OR ('CB-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countCalculationBasisRepo = async (
  filters: Omit<ListCalculationBasisFilters, 'limit' | 'offset'>
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

export const listCalculationBasisPaginatedRepo = async (
  filters: ListCalculationBasisFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<CalculationBasisRow>(
    `
    SELECT
      id::text,
      calculation_basis_name,
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

export const existsCalculationBasisNameRepo = async ({
  calculationBasisName,
  excludeId,
}: {
  calculationBasisName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM calculation_basis_master
    WHERE LOWER(calculation_basis_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [calculationBasisName, excludeId ?? null]
  );
};

export const updateCalculationBasisRepo = async ({
  id,
  calculationBasisName,
  status,
}: {
  id: string | number;
  calculationBasisName?: string;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE calculation_basis_master
    SET
      calculation_basis_name = COALESCE($2, calculation_basis_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      calculation_basis_name,
      status,
      created_at,
      updated_at
    `,
    [id, calculationBasisName ?? null, status ?? null]
  );
};

export const softDeleteCalculationBasisByIdRepo = async (
  id: string | number
) => {
  return pool.query(
    `
    UPDATE calculation_basis_master
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
