import { pool } from '@/backend/config/db';

export const createAcademicYearRepo = async (args: {
  name: string;
  shortForm: string;
  shortForm2Digit: string;
  status: string;
  createdBy: string | null;
}) =>
  pool.query(
    `
    INSERT INTO academic_year_master
      (name, short_form, short_form_2_digit, status, is_deleted, created_by)
    VALUES ($1, $2, $3, $4, FALSE, $5)
    RETURNING id::text, name, short_form, short_form_2_digit, status, created_at, updated_at
    `,
    [args.name, args.shortForm, args.shortForm2Digit, args.status, args.createdBy]
  );

export const listAcademicYearsRepo = async () =>
  pool.query(`
    SELECT id::text AS id, name, short_form, short_form_2_digit, status, created_at, updated_at
    FROM academic_year_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);

export const existsAcademicYearNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM academic_year_master
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [name, excludeId ?? null]
  );

export const existsAcademicYearShortRepo = (
  shortForm: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM academic_year_master
    WHERE LOWER(TRIM(short_form)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [shortForm, excludeId ?? null]
  );

export const updateAcademicYearRepo = async (args: {
  id: string | number;
  name: string;
  shortForm: string;
  shortForm2Digit: string;
  status: string;
  updatedBy: string | null;
}) =>
  pool.query(
    `
    UPDATE academic_year_master
    SET name = $2, short_form = $3, short_form_2_digit = $4, status = $5, updated_by = $6, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, name, short_form, short_form_2_digit, status, created_at, updated_at
    `,
    [
      args.id,
      args.name,
      args.shortForm,
      args.shortForm2Digit,
      args.status,
      args.updatedBy,
    ]
  );

export const softDeleteAcademicYearRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE academic_year_master SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
