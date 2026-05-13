import { pool } from '@/backend/config/db';

export type ModeOfPaymentRow = {
  id: string;
  mode_of_payment_name: string;
  name_on_receipt: string;
  visible_to_parent: string;
  visible_to_fee_counter: string;
  order_of_preference: number;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export const createModeOfPaymentRepo = async ({
  modeOfPaymentName,
  nameOnReceipt,
  visibleToParent,
  visibleToFeeCounter,
  orderOfPreference,
  status,
  createdBy,
}: {
  modeOfPaymentName: string;
  nameOnReceipt: string;
  visibleToParent: string;
  visibleToFeeCounter: string;
  orderOfPreference: number;
  status: string;
  createdBy: number;
}) => {
  return pool.query(
    `
    INSERT INTO mode_of_payment_master
      (
        mode_of_payment_name,
        name_on_receipt,
        visible_to_parent,
        visible_to_fee_counter,
        order_of_preference,
        status,
        is_deleted,
        created_by
      )
    VALUES
      ($1, $2, $3, $4, $5, $6, FALSE, $7)
    RETURNING
      id,
      mode_of_payment_name,
      name_on_receipt,
      visible_to_parent,
      visible_to_fee_counter,
      order_of_preference,
      status,
      created_at,
      updated_at
    `,
    [
      modeOfPaymentName,
      nameOnReceipt,
      visibleToParent,
      visibleToFeeCounter,
      orderOfPreference,
      status,
      createdBy,
    ]
  );
};

export type ListModeOfPaymentFilters = {
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
  limit: number;
  offset: number;
};

const baseWhere = `
  FROM mode_of_payment_master
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
      OR mode_of_payment_name ILIKE $${i}
      OR name_on_receipt ILIKE $${i}
      OR visible_to_parent ILIKE $${i}
      OR visible_to_fee_counter ILIKE $${i}
      OR CAST(order_of_preference AS TEXT) ILIKE $${i}
      OR status ILIKE $${i}
      OR ('MP-' || LPAD(id::text, GREATEST(3, LENGTH(id::text)), '0')) ILIKE $${i}
    )`);
    params.push(`%${trimmed}%`);
    i += 1;
  }

  const whereExtra =
    conditions.length > 0 ? ` AND ${conditions.join(' AND ')}` : '';
  return { whereExtra, params };
}

export const countModeOfPaymentRepo = async (
  filters: Omit<ListModeOfPaymentFilters, 'limit' | 'offset'>
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

export const listModeOfPaymentPaginatedRepo = async (
  filters: ListModeOfPaymentFilters
) => {
  const { whereExtra, params } = buildFilterClause(
    filters.q,
    filters.statusFilter
  );
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;
  return pool.query<ModeOfPaymentRow>(
    `
    SELECT
      id::text,
      mode_of_payment_name,
      name_on_receipt,
      visible_to_parent,
      visible_to_fee_counter,
      order_of_preference,
      status,
      created_at,
      updated_at
    ${baseWhere}
    ${whereExtra}
    ORDER BY order_of_preference ASC, id ASC
    LIMIT $${limitParam} OFFSET $${offsetParam}
    `,
    [...params, filters.limit, filters.offset]
  );
};

export const existsModeOfPaymentNameRepo = async ({
  modeOfPaymentName,
  excludeId,
}: {
  modeOfPaymentName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM mode_of_payment_master
    WHERE LOWER(mode_of_payment_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [modeOfPaymentName, excludeId ?? null]
  );
};

export const updateModeOfPaymentRepo = async ({
  id,
  modeOfPaymentName,
  nameOnReceipt,
  visibleToParent,
  visibleToFeeCounter,
  orderOfPreference,
  status,
}: {
  id: string | number;
  modeOfPaymentName?: string;
  nameOnReceipt?: string;
  visibleToParent?: string;
  visibleToFeeCounter?: string;
  orderOfPreference?: number;
  status?: string;
}) => {
  return pool.query(
    `
    UPDATE mode_of_payment_master
    SET
      mode_of_payment_name = COALESCE($2, mode_of_payment_name),
      name_on_receipt = COALESCE($3, name_on_receipt),
      visible_to_parent = COALESCE($4, visible_to_parent),
      visible_to_fee_counter = COALESCE($5, visible_to_fee_counter),
      order_of_preference = COALESCE($6, order_of_preference),
      status = COALESCE($7, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      mode_of_payment_name,
      name_on_receipt,
      visible_to_parent,
      visible_to_fee_counter,
      order_of_preference,
      status,
      created_at,
      updated_at
    `,
    [
      id,
      modeOfPaymentName ?? null,
      nameOnReceipt ?? null,
      visibleToParent ?? null,
      visibleToFeeCounter ?? null,
      orderOfPreference ?? null,
      status ?? null,
    ]
  );
};

export const softDeleteModeOfPaymentByIdRepo = async (id: string | number) => {
  return pool.query(
    `
    UPDATE mode_of_payment_master
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
