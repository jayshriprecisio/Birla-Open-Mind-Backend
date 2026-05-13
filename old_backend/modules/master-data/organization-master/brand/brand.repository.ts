import { pool } from '@/backend/config/db';

export const createBrandRepo = async ({
  name,
  brandCode,
  status,
}: {
  name: string;
  brandCode: string;
  status: string;
}) => {
  return await pool.query(
    `
    INSERT INTO brand_master
      (name, brand_code, status)
    VALUES
      ($1, $2, $3)
    RETURNING
      id,
      name,
      brand_code,
      status,
      created_at,
      updated_at
    `,
    [name, brandCode, status]
  );
};

export const getBrandsRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      name,
      brand_code,
      status,
      created_at,
      updated_at
    FROM brand_master
    ORDER BY id ASC
    `
  );
};

export const existsBrandCodeRepo = async ({
  brandCode,
  excludeId,
}: {
  brandCode: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM brand_master
    WHERE LOWER(brand_code) = LOWER($1)
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [brandCode, excludeId ?? null]
  );
};

export const existsBrandNameRepo = async ({
  name,
  excludeId,
}: {
  name: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM brand_master
    WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [name, excludeId ?? null]
  );
};

export const updateBrandRepo = async ({
  id,
  name,
  brandCode,
  status,
}: {
  id: string | number;
  name?: string;
  brandCode?: string;
  status?: string;
}) => {
  return await pool.query(
    `
    UPDATE brand_master
    SET
      name = COALESCE($2, name),
      brand_code = COALESCE($3, brand_code),
      status = COALESCE($4, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1::bigint
    RETURNING
      id,
      name,
      brand_code,
      status,
      created_at,
      updated_at
    `,
    [id, name ?? null, brandCode ?? null, status ?? null]
  );
};

export const deleteBrandByIdRepo = async (
  id: string | number
) => {
  return await pool.query(
    `
    DELETE FROM brand_master
    WHERE id = $1::bigint
    RETURNING id
    `,
    [id]
  );
};
