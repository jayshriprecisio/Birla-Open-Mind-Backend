import { pool } from '@/backend/config/db';

export const createHouseRepo = async ({
  houseName,
  shortForm,
  status,
  createdBy,
}: {
  houseName: string;
  shortForm: string;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO house_master
      (house_name, short_form, status, is_deleted, created_by)
    VALUES
      ($1, $2, $3, FALSE, $4)
    RETURNING
      id,
      house_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [houseName, shortForm, status, createdBy]
  );
};

export const getHousesRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      house_name,
      short_form,
      status,
      created_at,
      updated_at
    FROM house_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
    `
  );
};

export const existsHouseNameRepo = async ({
  houseName,
  excludeId,
}: {
  houseName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM house_master
    WHERE LOWER(house_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [houseName, excludeId ?? null]
  );
};

export const existsHouseShortFormRepo = async ({
  shortForm,
  excludeId,
}: {
  shortForm: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM house_master
    WHERE LOWER(short_form) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [shortForm, excludeId ?? null]
  );
};

export const updateHouseRepo = async ({
  id,
  houseName,
  shortForm,
  status,
}: {
  id: string | number;
  houseName?: string;
  shortForm?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE house_master
    SET
      house_name = COALESCE($2, house_name),
      short_form = COALESCE($3, short_form),
      status = COALESCE($4, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      house_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [id, houseName ?? null, shortForm ?? null, status ?? null]
  );
};

export const softDeleteHouseByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE house_master
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
