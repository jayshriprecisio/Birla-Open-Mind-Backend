import { pool } from '@/backend/config/db';

export const createBloodGroupRepo = async (args: {
  name: string;
  status: string;
  createdBy: number | null;
}) =>
  pool.query(
    `
    INSERT INTO blood_group_master
      (blood_group, status, is_deleted, created_by)
    VALUES ($1, $2, FALSE, $3)
    RETURNING id::text, blood_group AS name, status, created_at, updated_at
    `,
    [args.name, args.status, args.createdBy]
  );

export const listBloodGroupsRepo = async () =>
  pool.query(`
    SELECT id::text AS id, blood_group AS name, status, created_at, updated_at
    FROM blood_group_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);

export const existsBloodGroupNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM blood_group_master
    WHERE LOWER(TRIM(blood_group)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [name, excludeId ?? null]
  );

export const updateBloodGroupRepo = async (args: {
  id: string | number;
  name: string;
  status: string;
}) =>
  pool.query(
    `
    UPDATE blood_group_master
    SET blood_group = $2, status = $3, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, blood_group AS name, status, created_at, updated_at
    `,
    [args.id, args.name, args.status]
  );

export const softDeleteBloodGroupRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE blood_group_master SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
