import { pool } from '@/backend/config/db';

export const createParameterRepo = async (args: {
  parameterName: string;
  status: string;
  createdBy: string | null;
}) =>
  pool.query(
    `
    INSERT INTO parameter_master
      (parameter_name, status, is_deleted, created_by)
    VALUES ($1, $2, FALSE, $3)
    RETURNING id::text, parameter_name, status, created_at, updated_at
    `,
    [args.parameterName, args.status, args.createdBy]
  );

export const listParametersRepo = async () =>
  pool.query(`
    SELECT id::text AS id, parameter_name, status, created_at, updated_at
    FROM parameter_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);

export const existsParameterNameRepo = (
  parameterName: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM parameter_master
    WHERE LOWER(TRIM(parameter_name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [parameterName, excludeId ?? null]
  );

export const updateParameterRepo = async (args: {
  id: string | number;
  parameterName: string;
  status: string;
  updatedBy: string | null;
}) =>
  pool.query(
    `
    UPDATE parameter_master
    SET parameter_name = $2, status = $3, updated_by = $4, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, parameter_name, status, created_at, updated_at
    `,
    [args.id, args.parameterName, args.status, args.updatedBy]
  );

export const softDeleteParameterRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE parameter_master SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
