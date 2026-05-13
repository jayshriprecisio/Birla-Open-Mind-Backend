import { pool } from '@/backend/config/db';

export const getWinterTimeGapsRepo = async () => {
  return await pool.query(`
    SELECT
      id,
      winter_timing_gap,
      (EXTRACT(EPOCH FROM winter_timing_gap) / 60)::integer AS gap_minutes,
      status,
      is_deleted,
      created_by,
      created_at,
      updated_at
    FROM winter_timing_gap_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY created_at DESC
  `);
};

export const createWinterTimeGapRepo = async ({
  gapMinutes,
  status,
  createdBy,
}: {
  gapMinutes: number;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO winter_timing_gap_master
    (
      winter_timing_gap,
      status,
      is_deleted,
      created_by
    )
    VALUES (($1::bigint * interval '1 minute'), $2, FALSE, $3)
    RETURNING *
    `,
    [gapMinutes, status, createdBy]
  );
};

export const updateWinterTimeGapRepo = async ({
  id,
  gapMinutes,
  status,
}: {
  id: number | string;
  gapMinutes?: number | null;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE winter_timing_gap_master
    SET
      winter_timing_gap = COALESCE(
        ($2::bigint * interval '1 minute'),
        winter_timing_gap
      ),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING *
    `,
    [id, gapMinutes ?? null, status]
  );
};

export const softDeleteWinterTimeGapByIdRepo = async (
  id: number | string
) => {
  return await pool.query(
    `
    UPDATE winter_timing_gap_master
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

export const existsWinterTimeGapRepo = async ({
  gapMinutes,
  excludeId,
}: {
  gapMinutes: number;
  excludeId?: number | string;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM winter_timing_gap_master
    WHERE (EXTRACT(EPOCH FROM winter_timing_gap) / 60)::bigint = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2)
    LIMIT 1
    `,
    [gapMinutes, excludeId ?? null]
  );
};
