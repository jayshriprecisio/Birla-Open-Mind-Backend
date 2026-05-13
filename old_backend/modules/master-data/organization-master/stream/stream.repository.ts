import { pool } from '@/backend/config/db';

export const createStreamRepo = async (args: {
  name: string;
  shortForm: string;
  status: string;
  createdBy: string | null;
}) =>
  pool.query(
    `
    INSERT INTO stream_master
      (name, short_form, status, is_deleted, created_by)
    VALUES ($1, $2, $3, FALSE, $4)
    RETURNING id::text, name, short_form, status, created_at, updated_at
    `,
    [args.name, args.shortForm, args.status, args.createdBy]
  );

export const listStreamsRepo = async () =>
  pool.query(`
    SELECT id::text AS id, name, short_form, status, created_at, updated_at
    FROM stream_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);

export const existsStreamNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM stream_master
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [name, excludeId ?? null]
  );

export const existsStreamShortRepo = (
  shortForm: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM stream_master
    WHERE LOWER(TRIM(short_form)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [shortForm, excludeId ?? null]
  );

export const updateStreamRepo = async (args: {
  id: string | number;
  name: string;
  shortForm: string;
  status: string;
  updatedBy: string | null;
}) =>
  pool.query(
    `
    UPDATE stream_master
    SET name = $2, short_form = $3, status = $4, updated_by = $5, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, name, short_form, status, created_at, updated_at
    `,
    [args.id, args.name, args.shortForm, args.status, args.updatedBy]
  );

export const softDeleteStreamRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE stream_master SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
