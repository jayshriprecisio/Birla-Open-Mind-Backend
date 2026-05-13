import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, school_name, mid, tid, edc_type, status, created_at, updated_at
    FROM paytm_mapping
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (
  schoolName: string,
  mid: string,
  tid: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1
     FROM paytm_mapping
     WHERE LOWER(TRIM(school_name)) = LOWER(TRIM($1))
       AND LOWER(TRIM(mid)) = LOWER(TRIM($2))
       AND LOWER(TRIM(tid)) = LOWER(TRIM($3))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($4::bigint IS NULL OR id <> $4::bigint)
     LIMIT 1`,
    [schoolName, mid, tid, excludeId ?? null]
  );

export const createRepo = (args: {
  school_name: string;
  mid: string;
  tid: string;
  edc_type: string;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO paytm_mapping
      (school_name, mid, tid, edc_type, status, is_deleted, created_by)
     VALUES ($1, $2, $3, $4, $5, FALSE, $6)
     RETURNING id::text AS id, school_name, mid, tid, edc_type, status, created_at, updated_at`,
    [args.school_name, args.mid, args.tid, args.edc_type, args.status, args.created_by]
  );

export const updateRepo = (args: {
  id: string | number;
  school_name: string;
  mid: string;
  tid: string;
  edc_type: string;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE paytm_mapping
     SET school_name = $2,
         mid = $3,
         tid = $4,
         edc_type = $5,
         status = $6,
         updated_by = $7,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, school_name, mid, tid, edc_type, status, created_at, updated_at`,
    [args.id, args.school_name, args.mid, args.tid, args.edc_type, args.status, args.updated_by]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE paytm_mapping
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
