import { pool } from '@/backend/config/db';

export const createBatchRepo = async ({
  batchName,
  shortForm,
  status,
  createdBy,
}: {
  batchName: string;
  shortForm: string;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO batch_master
      (batch_name, short_form, status, is_deleted, created_by)
    VALUES
      ($1, $2, $3, FALSE, $4)
    RETURNING
      id,
      batch_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [batchName, shortForm, status, createdBy]
  );
};

export const getBatchesRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      batch_name,
      short_form,
      status,
      created_at,
      updated_at
    FROM batch_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
    `
  );
};

export const existsBatchNameRepo = async ({
  batchName,
  excludeId,
}: {
  batchName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM batch_master
    WHERE LOWER(batch_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [batchName, excludeId ?? null]
  );
};

export const existsBatchShortFormRepo = async ({
  shortForm,
  excludeId,
}: {
  shortForm: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM batch_master
    WHERE LOWER(short_form) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [shortForm, excludeId ?? null]
  );
};

export const updateBatchRepo = async ({
  id,
  batchName,
  shortForm,
  status,
}: {
  id: string | number;
  batchName?: string;
  shortForm?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE batch_master
    SET
      batch_name = COALESCE($2, batch_name),
      short_form = COALESCE($3, short_form),
      status = COALESCE($4, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      batch_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [id, batchName ?? null, shortForm ?? null, status ?? null]
  );
};

export const softDeleteBatchByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE batch_master
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
