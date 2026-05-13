import { pool } from '@/backend/config/db';

export type PeriodOfServiceRow = {
  id: string;
  period_of_service_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createPeriodOfServiceRepo = async ({
  periodOfServiceName,
  status,
  createdBy,
}: {
  periodOfServiceName: string;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO period_of_service_master
      (period_of_service_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      period_of_service_name,
      status,
      created_at,
      updated_at
    `,
    [periodOfServiceName, status, createdBy]
  );
};

export type ListPeriodOfServiceFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM period_of_service_master
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
      OR period_of_service_name ILIKE $${i}
      OR status ILIKE $${i}
      OR ('PS-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countPeriodOfServicesRepo = async (
  filters: Omit<ListPeriodOfServiceFilters, 'limit' | 'offset'>
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

export const listPeriodOfServicesPaginatedRepo = async (
  filters: ListPeriodOfServiceFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<PeriodOfServiceRow>(
    `
    SELECT
      id::text,
      period_of_service_name,
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

export const existsPeriodOfServiceNameRepo = async ({
  periodOfServiceName,
  excludeId,
}: {
  periodOfServiceName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM period_of_service_master
    WHERE LOWER(period_of_service_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [periodOfServiceName, excludeId ?? null]
  );
};

export const updatePeriodOfServiceRepo = async ({
  id,
  periodOfServiceName,
  status,
}: {
  id: string | number;
  periodOfServiceName?: string;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE period_of_service_master
    SET
      period_of_service_name = COALESCE($2, period_of_service_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      period_of_service_name,
      status,
      created_at,
      updated_at
    `,
    [id, periodOfServiceName ?? null, status ?? null]
  );
};

export const softDeletePeriodOfServiceByIdRepo = async (
  id: string | number
) => {
  return pool.query(
    `
    UPDATE period_of_service_master
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
