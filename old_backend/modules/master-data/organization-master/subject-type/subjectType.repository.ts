import { pool } from '@/backend/config/db';

export const createSubjectTypeRepo = async (args: {
  name: string;
  shortForm: string | null;
  status: string;
  createdBy: string | null;
}) =>
  pool.query(
    `
    INSERT INTO subject_type_master
      (name, short_form, status, is_deleted, created_by)
    VALUES ($1, $2, $3, FALSE, $4)
    RETURNING id::text, name, short_form, status, created_at, updated_at
    `,
    [args.name, args.shortForm, args.status, args.createdBy]
  );

export const listSubjectTypesRepo = async () =>
  pool.query(`
    SELECT id::text AS id, name, short_form, status, created_at, updated_at
    FROM subject_type_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);

export const existsSubjectTypeNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1 FROM subject_type_master
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint) LIMIT 1`,
    [name, excludeId ?? null]
  );

export const existsSubjectTypeShortRepo = (
  shortForm: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1 FROM subject_type_master
    WHERE short_form IS NOT NULL
      AND LOWER(TRIM(short_form)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint) LIMIT 1`,
    [shortForm, excludeId ?? null]
  );

export const updateSubjectTypeRepo = async (args: {
  id: string | number;
  name: string;
  shortForm: string | null;
  status: string;
  updatedBy: string | null;
}) =>
  pool.query(
    `
    UPDATE subject_type_master
    SET name = $2, short_form = NULLIF(TRIM($3::text), ''), status = $4,
        updated_by = $5, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text AS id, name, short_form, status, created_at, updated_at
    `,
    [args.id, args.name, args.shortForm ?? '', args.status, args.updatedBy]
  );

export const softDeleteSubjectTypeRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE subject_type_master SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
