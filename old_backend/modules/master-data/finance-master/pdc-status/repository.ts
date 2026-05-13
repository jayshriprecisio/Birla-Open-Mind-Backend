import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, pdc_status, description, status, created_at, updated_at
    FROM pdc_status_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (pdcStatus: string, excludeId?: string | number) =>
  pool.query(
    `SELECT 1
     FROM pdc_status_master
     WHERE LOWER(TRIM(pdc_status)) = LOWER(TRIM($1))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($2::bigint IS NULL OR id <> $2::bigint)
     LIMIT 1`,
    [pdcStatus, excludeId ?? null]
  );

export const createRepo = (args: {
  pdc_status: string;
  description: string | null;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO pdc_status_master
      (pdc_status, description, status, is_deleted, created_by)
     VALUES ($1, $2, $3, FALSE, $4)
     RETURNING id::text AS id, pdc_status, description, status, created_at, updated_at`,
    [args.pdc_status, args.description, args.status, args.created_by]
  );

export const updateRepo = (args: {
  id: string | number;
  pdc_status: string;
  description: string | null;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE pdc_status_master
     SET pdc_status = $2,
         description = $3,
         status = $4,
         updated_by = $5,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, pdc_status, description, status, created_at, updated_at`,
    [args.id, args.pdc_status, args.description, args.status, args.updated_by]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE pdc_status_master
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
