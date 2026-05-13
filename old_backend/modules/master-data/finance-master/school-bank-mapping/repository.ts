import { pool } from '@/backend/config/db';

export const listRepo = () =>
  pool.query(`
    SELECT id::text AS id, school_name, bank_name, account_number, ifsc_code, account_type, status, created_at, updated_at
    FROM school_bank_mapping
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
  `);

export const existsDuplicateRepo = (
  schoolName: string,
  bankName: string,
  accountNumber: string,
  excludeId?: string | number
) =>
  pool.query(
    `SELECT 1
     FROM school_bank_mapping
     WHERE LOWER(TRIM(school_name)) = LOWER(TRIM($1))
       AND LOWER(TRIM(bank_name)) = LOWER(TRIM($2))
       AND LOWER(TRIM(account_number)) = LOWER(TRIM($3))
       AND COALESCE(is_deleted, FALSE) = FALSE
       AND ($4::bigint IS NULL OR id <> $4::bigint)
     LIMIT 1`,
    [schoolName, bankName, accountNumber, excludeId ?? null]
  );

export const createRepo = (args: {
  school_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: string;
  status: string;
  created_by: string | null;
}) =>
  pool.query(
    `INSERT INTO school_bank_mapping
      (school_name, bank_name, account_number, ifsc_code, account_type, status, is_deleted, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, FALSE, $7)
     RETURNING id::text AS id, school_name, bank_name, account_number, ifsc_code, account_type, status, created_at, updated_at`,
    [
      args.school_name,
      args.bank_name,
      args.account_number,
      args.ifsc_code,
      args.account_type,
      args.status,
      args.created_by,
    ]
  );

export const updateRepo = (args: {
  id: string | number;
  school_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: string;
  status: string;
  updated_by: string | null;
}) =>
  pool.query(
    `UPDATE school_bank_mapping
     SET school_name = $2,
         bank_name = $3,
         account_number = $4,
         ifsc_code = $5,
         account_type = $6,
         status = $7,
         updated_by = $8,
         updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id::text AS id, school_name, bank_name, account_number, ifsc_code, account_type, status, created_at, updated_at`,
    [
      args.id,
      args.school_name,
      args.bank_name,
      args.account_number,
      args.ifsc_code,
      args.account_type,
      args.status,
      args.updated_by,
    ]
  );

export const softDeleteRepo = (id: string | number) =>
  pool.query(
    `UPDATE school_bank_mapping
     SET is_deleted = TRUE, updated_at = NOW()
     WHERE id = $1::bigint
       AND COALESCE(is_deleted, FALSE) = FALSE
     RETURNING id`,
    [id]
  );
