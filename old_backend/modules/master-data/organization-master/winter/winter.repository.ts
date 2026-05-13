import { pool } from '@/backend/config/db';

export const getWintersRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      winter_code,
      winter_duration_days,
      winter_start_date,
      winter_end_date,
      status,
      is_deleted,
      created_at,
      updated_at
    FROM winter_duration_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY created_at DESC
    `
  );
};

export const createWinterRepo = async ({
  winterCode,
  winterDurationDays,
  winterStartDate,
  winterEndDate,
  status,
}: {
  winterCode: string;
  winterDurationDays: number;
  winterStartDate: string;
  winterEndDate: string;
  status: string;
}) => {
  return await pool.query(
    `
    INSERT INTO winter_duration_master
    (
      winter_code,
      winter_duration_days,
      winter_start_date,
      winter_end_date,
      status,
      is_deleted
    )
    VALUES ($1, $2, $3, $4, $5, FALSE)
    RETURNING *
    `,
    [
      winterCode,
      winterDurationDays,
      winterStartDate,
      winterEndDate,
      status,
    ]
  );
};

export const updateWinterRepo = async ({
  id,
  winterCode,
  winterDurationDays,
  winterStartDate,
  winterEndDate,
  status,
}: {
  id: string | number;
  winterCode?: string;
  winterDurationDays?: number;
  winterStartDate?: string;
  winterEndDate?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE winter_duration_master
    SET
      winter_code = COALESCE($2, winter_code),
      winter_duration_days = COALESCE($3, winter_duration_days),
      winter_start_date = COALESCE($4, winter_start_date),
      winter_end_date = COALESCE($5, winter_end_date),
      status = COALESCE($6, status),
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING *
    `,
    [
      id,
      winterCode,
      winterDurationDays,
      winterStartDate,
      winterEndDate,
      status,
    ]
  );
};

export const softDeleteWinterByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE winter_duration_master
    SET
      is_deleted = TRUE,
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id]
  );
};

export const softDeleteWinterByCodeRepo = async (
  winterCode: string
) => {
  return await pool.query(
    `
    UPDATE winter_duration_master
    SET
      is_deleted = TRUE,
      updated_at = NOW()
    WHERE winter_code = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [winterCode]
  );
};

export const existsWinterCodeRepo = async ({
  winterCode,
  excludeId,
}: {
  winterCode: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM winter_duration_master
    WHERE winter_code = $1
      AND ($2::bigint IS NULL OR id <> $2)
    LIMIT 1
    `,
    [winterCode, excludeId ?? null]
  );
};

export const existsWinterRangeRepo = async ({
  winterStartDate,
  winterEndDate,
  excludeId,
}: {
  winterStartDate: string;
  winterEndDate: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM winter_duration_master
    WHERE winter_start_date = $1
      AND winter_end_date = $2
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($3::bigint IS NULL OR id <> $3)
    LIMIT 1
    `,
    [winterStartDate, winterEndDate, excludeId ?? null]
  );
};
