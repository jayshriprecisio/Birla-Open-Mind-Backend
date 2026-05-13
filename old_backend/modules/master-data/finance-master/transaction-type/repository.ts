import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, transaction_type, status, created_at, updated_at
    FROM transaction_type_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (
  transactionType: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1
     FROM transaction_type_master
     WHERE LOWER(TRIM(transaction_type)) = LOWER(TRIM($1))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($2::bigint IS NULL OR id <> $2::bigint)
     LIMIT 1`,
    [transactionType, excludeId ?? null]
  );

export const createRepo = (args: {
  transaction_type: string;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO transaction_type_master
      (transaction_type, status, is_deleted, created_by)
     VALUES ($1, $2, FALSE, $3)
     RETURNING id::text AS id, transaction_type, status, created_at, updated_at`,
    [args.transaction_type, args.status, args.created_by]
  );

export const updateRepo = (args: {
  id: string | number;
  transaction_type: string;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE transaction_type_master
     SET transaction_type = $2,
         status = $3,
         updated_by = $4,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, transaction_type, status, created_at, updated_at`,
    [args.id, args.transaction_type, args.status, args.updated_by]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE transaction_type_master
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
