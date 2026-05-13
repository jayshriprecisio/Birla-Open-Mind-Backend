import { pool } from '@/backend/config/db';

export const createZoneRepo = async ({
  zoneName,
  shortForm,
  status,
  createdBy,
}: {
  zoneName: string;
  shortForm: string;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO zone_master
      (zone_name, short_form, status, is_deleted, created_by)
    VALUES
      ($1, $2, $3, FALSE, $4)
    RETURNING
      id,
      zone_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [zoneName, shortForm, status, createdBy]
  );
};

export const getZonesRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      zone_name,
      short_form,
      status,
      created_at,
      updated_at
    FROM zone_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
    `
  );
};

export const existsZoneNameRepo = async ({
  zoneName,
  excludeId,
}: {
  zoneName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM zone_master
    WHERE LOWER(zone_name) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [zoneName, excludeId ?? null]
  );
};

export const existsZoneShortFormRepo = async ({
  shortForm,
  excludeId,
}: {
  shortForm: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM zone_master
    WHERE LOWER(short_form) = LOWER($1)
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [shortForm, excludeId ?? null]
  );
};

export const updateZoneRepo = async ({
  id,
  zoneName,
  shortForm,
  status,
}: {
  id: string | number;
  zoneName?: string;
  shortForm?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE zone_master
    SET
      zone_name = COALESCE($2, zone_name),
      short_form = COALESCE($3, short_form),
      status = COALESCE($4, status),
      updated_at = NOW()
    WHERE id = $1::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING
      id,
      zone_name,
      short_form,
      status,
      created_at,
      updated_at
    `,
    [id, zoneName ?? null, shortForm ?? null, status ?? null]
  );
};

export const softDeleteZoneByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    UPDATE zone_master
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
