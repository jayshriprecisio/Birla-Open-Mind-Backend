import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, school_name, merchant_key, merchant_salt, environment, status, created_at, updated_at
    FROM easebuzz_mapping
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (
  schoolName: string,
  merchantKey: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1
     FROM easebuzz_mapping
     WHERE LOWER(TRIM(school_name)) = LOWER(TRIM($1))
       AND LOWER(TRIM(merchant_key)) = LOWER(TRIM($2))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($3::bigint IS NULL OR id <> $3::bigint)
     LIMIT 1`,
    [schoolName, merchantKey, excludeId ?? null]
  );

export const createRepo = (args: {
  school_name: string;
  merchant_key: string;
  merchant_salt: string;
  environment: string;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO easebuzz_mapping
      (school_name, merchant_key, merchant_salt, environment, status, is_deleted, created_by)
     VALUES ($1, $2, $3, $4, $5, FALSE, $6)
     RETURNING id::text AS id, school_name, merchant_key, merchant_salt, environment, status, created_at, updated_at`,
    [
      args.school_name,
      args.merchant_key,
      args.merchant_salt,
      args.environment,
      args.status,
      args.created_by,
    ]
  );

export const updateRepo = (args: {
  id: string | number;
  school_name: string;
  merchant_key: string;
  merchant_salt: string;
  environment: string;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE easebuzz_mapping
     SET school_name = $2,
         merchant_key = $3,
         merchant_salt = $4,
         environment = $5,
         status = $6,
         updated_by = $7,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, school_name, merchant_key, merchant_salt, environment, status, created_at, updated_at`,
    [
      args.id,
      args.school_name,
      args.merchant_key,
      args.merchant_salt,
      args.environment,
      args.status,
      args.updated_by,
    ]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE easebuzz_mapping
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
