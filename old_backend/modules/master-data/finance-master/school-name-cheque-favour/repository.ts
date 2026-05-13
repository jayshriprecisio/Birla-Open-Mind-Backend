import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, cheque_in_favour_of, fees_type, status, created_at, updated_at
    FROM cheque_favour_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (
  chequeInFavourOf: string,
  feesType: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1
     FROM cheque_favour_master
     WHERE LOWER(TRIM(cheque_in_favour_of)) = LOWER(TRIM($1))
       AND LOWER(TRIM(fees_type)) = LOWER(TRIM($2))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($3::bigint IS NULL OR id <> $3::bigint)
     LIMIT 1`,
    [chequeInFavourOf, feesType, excludeId ?? null]
  );

export const createRepo = (args: {
  cheque_in_favour_of: string;
  fees_type: string;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO cheque_favour_master
      (cheque_in_favour_of, fees_type, status, is_deleted, created_by)
     VALUES ($1, $2, $3, FALSE, $4)
     RETURNING id::text AS id, cheque_in_favour_of, fees_type, status, created_at, updated_at`,
    [args.cheque_in_favour_of, args.fees_type, args.status, args.created_by]
  );

export const updateRepo = (args: {
  id: string | number;
  cheque_in_favour_of: string;
  fees_type: string;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE cheque_favour_master
     SET cheque_in_favour_of = $2,
         fees_type = $3,
         status = $4,
         updated_by = $5,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, cheque_in_favour_of, fees_type, status, created_at, updated_at`,
    [args.id, args.cheque_in_favour_of, args.fees_type, args.status, args.updated_by]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE cheque_favour_master
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
