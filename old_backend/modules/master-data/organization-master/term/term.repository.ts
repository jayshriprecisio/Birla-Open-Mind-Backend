import { pool } from '@/backend/config/db';

export const createTermRepo = async ({
  termName,
  shortForm,
  status,
  createdBy,
}: {
  termName: string;
  shortForm: string;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO term_master
      (term_name, short_form, status, is_deleted, created_by)
    VALUES
      ($1, $2, $3, FALSE, $4)
    RETURNING
      id,
      term_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [termName, shortForm, status, createdBy]
  );
};

export const getTermsRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      term_name,
      short_form,
      status,
      created_at,
      updated_at
    FROM term_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
    `
  );
};

export const existsTermNameRepo = async ({
  termName,
  excludeId,
}: {
  termName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM term_master
    WHERE LOWER(term_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [termName, excludeId ?? null]
  );
};

export const existsTermShortFormRepo = async ({
  shortForm,
  excludeId,
}: {
  shortForm: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM term_master
    WHERE LOWER(short_form) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [shortForm, excludeId ?? null]
  );
};

export const updateTermRepo = async ({
  id,
  termName,
  shortForm,
  status,
}: {
  id: string | number;
  termName?: string;
  shortForm?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE term_master
    SET
      term_name = COALESCE($2, term_name),
      short_form = COALESCE($3, short_form),
      status = COALESCE($4, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      term_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [id, termName ?? null, shortForm ?? null, status ?? null]
  );
};

export const softDeleteTermByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE term_master
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
