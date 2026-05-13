import { pool } from '@/backend/config/db';

export const createDivisionRepo = async ({
  divisionName,
  status,
  createdBy,
}: {
  divisionName: string;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO division_master
      (division_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      division_name,
      status,
      created_at,
      updated_at
    `,
    [divisionName, status, createdBy]
  );
};

export const getDivisionsRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      division_name,
      status,
      created_at,
      updated_at
    FROM division_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY created_at DESC
    `
  );
};

export const existsDivisionNameRepo = async ({
  divisionName,
  excludeId,
}: {
  divisionName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM division_master
    WHERE LOWER(division_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [divisionName, excludeId ?? null]
  );
};

export const updateDivisionRepo = async ({
  id,
  divisionName,
  status,
}: {
  id: string | number;
  divisionName?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE division_master
    SET
      division_name = COALESCE($2, division_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      division_name,
      status,
      created_at,
      updated_at
    `,
    [id, divisionName ?? null, status ?? null]
  );
};

export const softDeleteDivisionByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE division_master
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
