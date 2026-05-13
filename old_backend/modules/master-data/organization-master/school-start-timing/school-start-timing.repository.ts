import { pool } from '@/backend/config/db';

export const createSchoolStartTimingRepo =
  async ({
    timingCode,
    shiftName,
    startTime,
    endTime,
    status,
    createdBy,
  }: {
    timingCode: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    status: string;
    createdBy: string;
  }) => {
    return await pool.query(
      `
    INSERT INTO school_timing_master
    (
      timing_code,
      shift_name,
      start_time,
      end_time,
      status,
      is_deleted,
      created_by,
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, FALSE, $6, $6)
    RETURNING *
    `,
      [
        timingCode,
        shiftName,
        startTime,
        endTime,
        status,
        createdBy,
      ]
    );
  };

export const getSchoolStartTimingsRepo =
  async () => {
    return await pool.query(
      `
    SELECT
      id,
      timing_code,
      shift_name,
      start_time,
      end_time,
      status,
      is_deleted,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM school_timing_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY created_at DESC
    `
    );
  };

export const existsShiftNameRepo = async ({
  shiftName,
  excludeId,
}: {
  shiftName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM school_timing_master
    WHERE LOWER(TRIM(shift_name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2)
    LIMIT 1
    `,
    [shiftName, excludeId ?? null]
  );
};

export const updateSchoolStartTimingRepo =
  async ({
    id,
    timingCode,
    shiftName,
    startTime,
    endTime,
    status,
    updatedBy,
  }: {
    id: string | number;
    timingCode?: string;
    shiftName?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
    updatedBy: string;
  }) => {
    return await pool.query(
      `
    UPDATE school_timing_master
    SET
      timing_code = COALESCE($2, timing_code),
      shift_name = COALESCE($3, shift_name),
      start_time = COALESCE($4, start_time),
      end_time = COALESCE($5, end_time),
      status = COALESCE($6, status),
      updated_by = $7,
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING *
    `,
      [
        id,
        timingCode,
        shiftName,
        startTime,
        endTime,
        status,
        updatedBy,
      ]
    );
  };

export const softDeleteSchoolStartTimingByIdRepo =
  async ({
    id,
    updatedBy,
  }: {
    id: string | number;
    updatedBy: string;
  }) => {
    return await pool.query(
      `
    UPDATE school_timing_master
    SET
      is_deleted = TRUE,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
      [id, updatedBy]
    );
  };

export const softDeleteSchoolStartTimingByCodeRepo =
  async ({
    timingCode,
    updatedBy,
  }: {
    timingCode: string;
    updatedBy: string;
  }) => {
    return await pool.query(
      `
    UPDATE school_timing_master
    SET
      is_deleted = TRUE,
      updated_by = $2,
      updated_at = NOW()
    WHERE timing_code = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
      [timingCode, updatedBy]
    );
  };
