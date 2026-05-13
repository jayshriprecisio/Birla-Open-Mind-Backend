import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, entity_name, status, created_at, updated_at
    FROM payment_entity_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (entityName: string, excludeId?: string | number) =>
  pool.query(
    `SELECT 1
     FROM payment_entity_master
     WHERE LOWER(TRIM(entity_name)) = LOWER(TRIM($1))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($2::bigint IS NULL OR id <> $2::bigint)
     LIMIT 1`,
    [entityName, excludeId ?? null]
  );

export const createRepo = (args: {
  entity_name: string;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO payment_entity_master
      (entity_name, status, is_deleted, created_by)
     VALUES ($1, $2, FALSE, $3)
     RETURNING id::text AS id, entity_name, status, created_at, updated_at`,
    [args.entity_name, args.status, args.created_by]
  );

export const updateRepo = (args: {
  id: string | number;
  entity_name: string;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE payment_entity_master
     SET entity_name = $2,
         status = $3,
         updated_by = $4,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, entity_name, status, created_at, updated_at`,
    [args.id, args.entity_name, args.status, args.updated_by]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE payment_entity_master
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
