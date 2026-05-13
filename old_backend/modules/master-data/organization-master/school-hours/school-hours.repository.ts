import { pool } from '@/backend/config/db';

export const getSchoolHoursRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      duration_code,
      duration_name,
      total_minutes,
      status,
      is_deleted,
      created_at,
      updated_at
    FROM school_hours_duration
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY created_at DESC
    `
  );
};

export const existsDurationNameRepo = async ({
  durationName,
  excludeId,
}: {
  durationName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM school_hours_duration
    WHERE LOWER(TRIM(duration_name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2)
    LIMIT 1
    `,
    [durationName, excludeId ?? null]
  );
};

export const existsDurationCodeRepo = async ({
  durationCode,
  excludeId,
}: {
  durationCode: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM school_hours_duration
    WHERE duration_code = $1
      AND ($2::bigint IS NULL OR id <> $2)
    LIMIT 1
    `,
    [durationCode, excludeId ?? null]
  );
};

export const createSchoolHoursRepo = async ({
  durationCode,
  durationName,
  totalMinutes,
  status,
}: {
  durationCode: string;
  durationName: string;
  totalMinutes: number;
  status: string;
}) => {
  return await pool.query(
    `
    INSERT INTO school_hours_duration
    (
      duration_code,
      duration_name,
      total_minutes,
      status,
      is_deleted
    )
    VALUES ($1, $2, $3, $4, FALSE)
    RETURNING *
    `,
    [durationCode, durationName, totalMinutes, status]
  );
};

export const updateSchoolHoursRepo = async ({
  id,
  durationCode,
  durationName,
  totalMinutes,
  status,
}: {
  id: string | number;
  durationCode?: string;
  durationName?: string;
  totalMinutes?: number;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE school_hours_duration
    SET
      duration_code = COALESCE($2, duration_code),
      duration_name = COALESCE($3, duration_name),
      total_minutes = COALESCE($4, total_minutes),
      status = COALESCE($5, status),
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING *
    `,
    [id, durationCode, durationName, totalMinutes, status]
  );
};

export const softDeleteSchoolHoursByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE school_hours_duration
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

export const softDeleteSchoolHoursByCodeRepo = async (
  durationCode: string
) => {
  return await pool.query(
    `
    UPDATE school_hours_duration
    SET
      is_deleted = TRUE,
      updated_at = NOW()
    WHERE duration_code = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [durationCode]
  );
};
