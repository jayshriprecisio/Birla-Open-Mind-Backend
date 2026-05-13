import { pool } from '@/backend/config/db';

export type ServiceProviderRow = {
  id: string;
  service_provider_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createServiceProviderRepo = async ({
  serviceProviderName,
  status,
  createdBy,
}: {
  serviceProviderName: string;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO service_provider_master
      (service_provider_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      service_provider_name,
      status,
      created_at,
      updated_at
    `,
    [serviceProviderName, status, createdBy]
  );
};

export type ListServiceProviderFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM service_provider_master
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
      OR service_provider_name ILIKE $${i}
      OR status ILIKE $${i}
      OR ('SP-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countServiceProviderRepo = async (
  filters: Omit<ListServiceProviderFilters, 'limit' | 'offset'>
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

export const listServiceProviderPaginatedRepo = async (
  filters: ListServiceProviderFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<ServiceProviderRow>(
    `
    SELECT
      id::text,
      service_provider_name,
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

export const existsServiceProviderNameRepo = async ({
  serviceProviderName,
  excludeId,
}: {
  serviceProviderName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM service_provider_master
    WHERE LOWER(service_provider_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [serviceProviderName, excludeId ?? null]
  );
};

export const updateServiceProviderRepo = async ({
  id,
  serviceProviderName,
  status,
}: {
  id: string | number;
  serviceProviderName?: string;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE service_provider_master
    SET
      service_provider_name = COALESCE($2, service_provider_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      service_provider_name,
      status,
      created_at,
      updated_at
    `,
    [id, serviceProviderName ?? null, status ?? null]
  );
};

export const softDeleteServiceProviderByIdRepo = async (
  id: string | number
) => {
  return pool.query(
    `
    UPDATE service_provider_master
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
