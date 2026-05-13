import { pool } from '@/backend/config/db';

export const createGenderRepo = async (args: {
  name: string;
  shortForm: string | null;
  displayOrder: number | null;
  status: string;
  createdBy: string | null;
}) =>
  pool.query(
    `
    INSERT INTO gender_master
      (name, short_form, display_order, status, is_deleted, created_by)
    VALUES ($1, $2, $3, $4, FALSE, $5)
    RETURNING id::text, name, short_form, display_order, status, created_at, updated_at
    `,
    [args.name, args.shortForm, args.displayOrder, args.status, args.createdBy]
  );

export const listGendersRepo = async () =>
  pool.query(`
    SELECT id::text AS id, name, short_form, display_order, status, created_at, updated_at
    FROM gender_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);

export const existsGenderNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM gender_master
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [name, excludeId ?? null]
  );

export const existsGenderShortRepo = (
  shortForm: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM gender_master
    WHERE short_form IS NOT NULL
      AND LOWER(TRIM(short_form)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [shortForm, excludeId ?? null]
  );

export const updateGenderRepo = async (args: {
  id: string | number;
  name: string;
  shortForm: string | null;
  displayOrder: number | null;
  status: string;
  updatedBy: string | null;
}) =>
  pool.query(
    `
    UPDATE gender_master
    SET name = $2, short_form = NULLIF(TRIM($3::text), ''), display_order = $4, status = $5, updated_by = $6, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, name, short_form, display_order, status, created_at, updated_at
    `,
    [args.id, args.name, args.shortForm ?? '', args.displayOrder, args.status, args.updatedBy]
  );

export const softDeleteGenderRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE gender_master SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
