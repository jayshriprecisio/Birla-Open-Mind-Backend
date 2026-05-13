import { pool } from '@/backend/config/db';

export const createSessionRepo = async ({
  sessionName,
  status,
  createdBy,
}: {
  sessionName: string;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO session_master
      (session_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING
      id,
      session_name,
      status,
      created_at,
      updated_at
    `,
    [sessionName, status, createdBy]
  );
};

export const getSessionsRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      session_name,
      status,
      created_at,
      updated_at
    FROM session_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
    `
  );
};

export const existsSessionNameRepo = async ({
  sessionName,
  excludeId,
}: {
  sessionName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM session_master
    WHERE LOWER(session_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [sessionName, excludeId ?? null]
  );
};

export const updateSessionRepo = async ({
  id,
  sessionName,
  status,
}: {
  id: string | number;
  sessionName?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE session_master
    SET
      session_name = COALESCE($2, session_name),
      status = COALESCE($3, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      session_name,
      status,
      created_at,
      updated_at
    `,
    [id, sessionName ?? null, status ?? null]
  );
};

export const softDeleteSessionByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE session_master
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
