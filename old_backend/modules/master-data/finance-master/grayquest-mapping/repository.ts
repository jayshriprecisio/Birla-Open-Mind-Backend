import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, school_name, institute_id, api_key, environment, status, created_at, updated_at
    FROM grayquest_mapping
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (
  schoolName: string,
  instituteId: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1
     FROM grayquest_mapping
     WHERE LOWER(TRIM(school_name)) = LOWER(TRIM($1))
       AND LOWER(TRIM(institute_id)) = LOWER(TRIM($2))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($3::bigint IS NULL OR id <> $3::bigint)
     LIMIT 1`,
    [schoolName, instituteId, excludeId ?? null]
  );

export const createRepo = (args: {
  school_name: string;
  institute_id: string;
  api_key: string;
  environment: string;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO grayquest_mapping
      (school_name, institute_id, api_key, environment, status, is_deleted, created_by)
     VALUES ($1, $2, $3, $4, $5, FALSE, $6)
     RETURNING id::text AS id, school_name, institute_id, api_key, environment, status, created_at, updated_at`,
    [
      args.school_name,
      args.institute_id,
      args.api_key,
      args.environment,
      args.status,
      args.created_by,
    ]
  );

export const updateRepo = (args: {
  id: string | number;
  school_name: string;
  institute_id: string;
  api_key: string;
  environment: string;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE grayquest_mapping
     SET school_name = $2,
         institute_id = $3,
         api_key = $4,
         environment = $5,
         status = $6,
         updated_by = $7,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, school_name, institute_id, api_key, environment, status, created_at, updated_at`,
    [
      args.id,
      args.school_name,
      args.institute_id,
      args.api_key,
      args.environment,
      args.status,
      args.updated_by,
    ]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE grayquest_mapping
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
